package com.joao.flowmodoro.services;

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class TimerService : Service() {

    override fun onCreate() {
        super.onCreate()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "flowmodoro",
                "Flowmodoro Timer",
                NotificationManager.IMPORTANCE_LOW
            )

            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val notification: Notification =
            NotificationCompat.Builder(this, "flowmodoro")
                .setContentTitle("Flowmodoro")
                .setContentText("Timer rodando...")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .build()

        startForeground(
            1,
            notification
        )

    }
    
    override fun onBind(p0: Intent?): IBinder? {
        return null;
    }
}