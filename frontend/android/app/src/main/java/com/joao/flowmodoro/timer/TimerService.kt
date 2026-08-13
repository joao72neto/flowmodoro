package com.joao.flowmodoro.timer

import android.app.Service
import android.content.Intent
import android.os.IBinder
import kotlinx.coroutines.*
import com.joao.flowmodoro.alarm.AlarmManager

class TimerService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var tickerJob: Job? = null
    private lateinit var notificationHelper: TimerNotificationHelper
    private lateinit var alarmManager: AlarmManager

    override fun onCreate() {
        super.onCreate()
        notificationHelper = TimerNotificationHelper(this)
        alarmManager = AlarmManager(this)

        startForeground(
            TimerNotificationHelper.NOTIFICATION_ID_TIMER,
            notificationHelper.buildTimerNotification(
                "00:00",
                false
            )
        )
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val anchor = intent?.getLongExtra(EXTRA_ANCHOR, System.currentTimeMillis())
            ?: System.currentTimeMillis()

        when (intent?.action) {
            ACTION_START_FOCUS -> startFocus(anchor)
            ACTION_START_BREAK -> {
                val restRatio = intent.getDoubleExtra(EXTRA_REST_RATIO, 0.2)
                val totalFocus = intent.getLongExtra(EXTRA_TOTAL_FOCUS, 0L)
                startBreak(anchor, totalFocus, restRatio)
            }

            ACTION_STOP -> stopTimer()
            else -> stopSelf()
        }
        return START_STICKY
    }

    private fun startFocus(anchor: Long) {
        tickerJob?.cancel()

        tickerJob = serviceScope.launch {
            while (isActive) {
                val elapsed = System.currentTimeMillis() - anchor

                notificationHelper.updateTimerNotification(
                    TimeFormatter.format(elapsed),
                    false
                )

                delay(1000)
            }
        }
    }


    private fun startBreak(anchor: Long, totalFocus: Long, restRatio: Double) {
        tickerJob?.cancel()

        val breakDuration = (totalFocus * restRatio).toLong();

        alarmManager.schedule(anchor, breakDuration)

        tickerJob = serviceScope.launch {
            while (isActive) {
                val elapsed = System.currentTimeMillis() - anchor
                val remaining = breakDuration - elapsed

                if (remaining <= 0) break

                notificationHelper.updateTimerNotification(
                    TimeFormatter.format(remaining),
                    true
                )

                delay(1000)
            }
        }
    }

    private fun stopTimer() {
        tickerJob?.cancel()
        alarmManager.cancel()
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
        const val EXTRA_TOTAL_FOCUS = "extra_total_focus"
        const val EXTRA_REST_RATIO = "extra_rest_ratio"
    }
}
