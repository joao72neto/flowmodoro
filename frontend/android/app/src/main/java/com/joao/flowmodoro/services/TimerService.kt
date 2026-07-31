package com.joao.flowmodoro.services;

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.joao.flowmodoro.R
import kotlinx.coroutines.*

class TimerService : Service() {

    private val serviceScope = CoroutineScope(
        Dispatchers.Default + SupervisorJob()
    )

    private var startTime = 0L

    override fun onCreate() {
        super.onCreate()

        createNotificationChannel()

        startForeground(
            1,
            createNotification("00:00")
        )

        startTime = System.currentTimeMillis()


        startTimer()
    }

    private fun createNotificationChannel() {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            val channel = NotificationChannel(
                "flowmodoro",
                "Flowmodoro Timer",
                NotificationManager.IMPORTANCE_LOW
            )

            val manager =
                getSystemService(NotificationManager::class.java)

            manager.createNotificationChannel(channel)
        }
    }


    private fun createNotification(time: String): Notification {

        return NotificationCompat.Builder(
            this,
            "flowmodoro"
        )
            .setContentTitle("Flowmodoro")
            .setContentText("Tempo: $time")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setOngoing(true)
            .build()
    }

    private fun startTimer() {
        serviceScope.launch {

            while (isActive) {

                val elapsed =
                    System.currentTimeMillis() - startTime

                val seconds = elapsed / 1000
                val minutes = seconds / 60
                val remainingSeconds = seconds % 60

                val time = String.format(
                    "%02d:%02d",
                    minutes,
                    remainingSeconds
                )

                updateNotification(time)

                delay(1000)
            }
        }
    }


    private fun updateNotification(time: String) {
        val notification = createNotification(time)

        val manager =
            getSystemService(NotificationManager::class.java)

        manager.notify(1, notification)
    }

    override fun onDestroy() {
        serviceScope.cancel()

        super.onDestroy()
    }

    override fun onBind(p0: Intent?): IBinder? {
        return null;
    }
}