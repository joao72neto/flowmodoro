package com.joao.flowmodoro.services

import android.app.Service
import android.content.Intent
import android.os.IBinder
import com.joao.flowmodoro.utils.TimeFormatter
import kotlinx.coroutines.*

class TimerService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var tickerJob: Job? = null
    private lateinit var notificationHelper: TimerNotificationHelper

    override fun onCreate() {
        super.onCreate()
        notificationHelper = TimerNotificationHelper(this)
        notificationHelper.createChannels()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START_FOCUS -> startFocus()
            ACTION_START_BREAK -> {
                val focusDuration = intent.getLongExtra(EXTRA_FOCUS_DURATION, 0L)
                val ratio = intent.getDoubleExtra(EXTRA_RATIO, 0.2)
                startBreak(focusDuration, ratio)
            }

            ACTION_STOP -> stopTimer()
            else -> {
                stopSelf()
            }
        }
        return START_STICKY
    }

    private fun startFocus() {
        tickerJob?.cancel()
        val startTime = System.currentTimeMillis()

        startForeground(
            TimerNotificationHelper.NOTIFICATION_ID_TIMER,
            notificationHelper.buildTimerNotification("00:00", isBreak = false)
        )

        tickerJob = serviceScope.launch {
            while (isActive) {
                val elapsed = System.currentTimeMillis() - startTime
                notificationHelper.updateTimerNotification(
                    TimeFormatter.format(elapsed),
                    isBreak = false
                )
                delay(1000)
            }
        }
    }

    private fun startBreak(focusDurationMillis: Long, ratio: Double) {
        tickerJob?.cancel()

        val breakDuration = (focusDurationMillis * ratio).toLong()

        if (breakDuration <= 0L) {
            return
        }

        val endTime = System.currentTimeMillis() + breakDuration

        startForeground(
            TimerNotificationHelper.NOTIFICATION_ID_TIMER,
            notificationHelper.buildTimerNotification(
                TimeFormatter.format(breakDuration),
                isBreak = true
            )
        )

        tickerJob = serviceScope.launch {
            while (isActive) {
                val remaining = endTime - System.currentTimeMillis()

                if (remaining <= 0) {
                    notificationHelper.updateTimerNotification("00:00", isBreak = true)
                    onBreakFinished()
                    break
                }

                notificationHelper.updateTimerNotification(
                    TimeFormatter.format(remaining),
                    isBreak = true
                )

                delay(1000)
            }
        }
    }

    private fun onBreakFinished() {
        notificationHelper.notifyBreakFinished()
        stopTimer()
    }

    private fun stopTimer() {
        tickerJob?.cancel()
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    override fun onDestroy() {
        serviceScope.cancel()
        super.onDestroy()
    }

    override fun onBind(p0: Intent?): IBinder? = null

    companion object {
        const val ACTION_START_FOCUS = "com.joao.flowmodoro.action.START_FOCUS"
        const val ACTION_START_BREAK = "com.joao.flowmodoro.action.START_BREAK"
        const val ACTION_STOP = "com.joao.flowmodoro.action.STOP"
        const val EXTRA_FOCUS_DURATION = "extra_focus_duration"
        const val EXTRA_RATIO = "extra_ratio"
    }
}