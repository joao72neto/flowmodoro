package com.joao.flowmodoro.services

import android.app.Service
import android.content.Intent
import android.os.IBinder
import com.joao.flowmodoro.utils.TimeFormatter
import kotlinx.coroutines.*
import com.joao.flowmodoro.alarm.BreakAlarmManager

class TimerService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var tickerJob: Job? = null
    private lateinit var notificationHelper: TimerNotificationHelper
    private lateinit var breakAlarmManager: BreakAlarmManager

    override fun onCreate() {
        super.onCreate()
        notificationHelper = TimerNotificationHelper(this)
        notificationHelper.createChannels()
        breakAlarmManager = BreakAlarmManager(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val anchor = intent?.getLongExtra(EXTRA_ANCHOR, System.currentTimeMillis())
            ?: System.currentTimeMillis()

        when (intent?.action) {
            ACTION_START_FOCUS -> startFocus(anchor)
            ACTION_START_BREAK -> {
                val restDurationMillis = intent.getLongExtra(EXTRA_REST_DURATION, 0L)
                startBreak(anchor, restDurationMillis)
            }

            ACTION_STOP -> stopTimer()
            else -> stopSelf()
        }
        return START_STICKY
    }

    private fun startFocus(anchor: Long) {
        tickerJob?.cancel()
        startForeground(
            TimerNotificationHelper.NOTIFICATION_ID_TIMER,
            notificationHelper.buildTimerNotification("00:00", false)
        )

        tickerJob = serviceScope.launch {
            while (isActive) {
                val elapsed = System.currentTimeMillis() - anchor
                notificationHelper.updateTimerNotification(TimeFormatter.format(elapsed), false)
                delay(1000)
            }
        }
    }


    private fun startBreak(anchor: Long, restDurationMillis: Long) {
        tickerJob?.cancel()

        startForeground(
            TimerNotificationHelper.NOTIFICATION_ID_TIMER,
            notificationHelper.buildTimerNotification(
                TimeFormatter.format(restDurationMillis),
                true
            )
        )
        breakAlarmManager.schedule(anchor, restDurationMillis)

        tickerJob = serviceScope.launch {
            while (isActive) {
                val elapsed = System.currentTimeMillis() - anchor
                val remaining = restDurationMillis - elapsed
                if (remaining <= 0) break
                notificationHelper.updateTimerNotification(TimeFormatter.format(remaining), true)
                delay(1000)
            }
        }
    }

    private fun stopTimer() {
        tickerJob?.cancel()
        breakAlarmManager.cancel()
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    override fun onDestroy() {
        serviceScope.cancel()
        super.onDestroy()
    }

    override fun onBind(p0: Intent?): IBinder? = null

    companion object {
        const val EXTRA_ANCHOR = "extra_anchor"
        const val ACTION_START_FOCUS = "com.joao.flowmodoro.action.START_FOCUS"
        const val ACTION_START_BREAK = "com.joao.flowmodoro.action.START_BREAK"
        const val ACTION_STOP = "com.joao.flowmodoro.action.STOP"
        const val EXTRA_REST_DURATION = "extra_rest_duration"
    }
}