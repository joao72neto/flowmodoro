package com.joao.flowmodoro.services

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import com.joao.flowmodoro.R

class TimerNotificationHelper(private val context: Context) {

    companion object {
        const val CHANNEL_ID = "flowmodoro"
        const val NOTIFICATION_ID = 1
    }

    private val manager =
        context.getSystemService(NotificationManager::class.java)

    fun createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Flowmodoro Timer",
                NotificationManager.IMPORTANCE_LOW
            )
            manager.createNotificationChannel(channel)
        }
    }

    fun build(time: String): Notification {
        return NotificationCompat.Builder(context, CHANNEL_ID)
            .setContentTitle("Flowmodoro")
            .setContentText("Tempo: $time")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setOngoing(true)
            .build()
    }

    fun update(time: String) {
        manager.notify(NOTIFICATION_ID, build(time))
    }
}