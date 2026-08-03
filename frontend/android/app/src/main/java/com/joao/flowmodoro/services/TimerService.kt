package com.joao.flowmodoro.services

import android.app.Service
import android.content.Intent
import android.os.IBinder
import com.joao.flowmodoro.utils.TimeFormatter
import kotlinx.coroutines.*

class TimerService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private lateinit var notificationHelper: TimerNotificationHelper
    private var startTime = 0L

    override fun onCreate() {
        super.onCreate()
        notificationHelper = TimerNotificationHelper(this)
        notificationHelper.createChannel()
        startForeground(
            TimerNotificationHelper.NOTIFICATION_ID,
            notificationHelper.build("00:00")
        )
        startTime = System.currentTimeMillis()
        startTimer()
    }

    private fun startTimer() {
        serviceScope.launch {
            while (isActive) {
                val elapsed = System.currentTimeMillis() - startTime
                notificationHelper.update(TimeFormatter.format(elapsed))
                delay(1000)
            }
        }
    }

    override fun onDestroy() {
        serviceScope.cancel()
        super.onDestroy()
    }

    override fun onBind(p0: Intent?): IBinder? = null
}