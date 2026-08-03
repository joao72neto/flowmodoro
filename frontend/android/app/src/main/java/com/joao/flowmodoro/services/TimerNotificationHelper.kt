package com.joao.flowmodoro.services

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import com.joao.flowmodoro.R

class TimerNotificationHelper(private val context: Context) {

    companion object {
        const val CHANNEL_TIMER_ID = "flowmodoro_timer"
        const val CHANNEL_ALARM_ID = "flowmodoro_alarm"
        const val NOTIFICATION_ID_TIMER = 1
        const val NOTIFICATION_ID_ALARM = 2
    }

    private val manager = context.getSystemService(NotificationManager::class.java)

    fun createChannels() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val timerChannel = NotificationChannel(
            CHANNEL_TIMER_ID, "Timer em andamento", NotificationManager.IMPORTANCE_LOW
        ).apply {
            setSound(null, null)
        }

        val alarmAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        val alarmChannel = NotificationChannel(
            CHANNEL_ALARM_ID, "Fim do descanso", NotificationManager.IMPORTANCE_HIGH
        ).apply {
            setSound(
                RingtoneManager.getActualDefaultRingtoneUri(context, RingtoneManager.TYPE_ALARM),
                alarmAttributes
            )
            enableVibration(true)
            lockscreenVisibility = Notification.VISIBILITY_PUBLIC
        }

        manager.createNotificationChannel(timerChannel)
        manager.createNotificationChannel(alarmChannel)
    }

    fun buildTimerNotification(time: String, isBreak: Boolean): Notification {
        val label = if (isBreak) "Descanso" else "Foco"
        return NotificationCompat.Builder(context, CHANNEL_TIMER_ID)
            .setContentTitle("Flowmodoro · $label")
            .setContentText("Tempo: $time")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .build()
    }

    fun updateTimerNotification(time: String, isBreak: Boolean) {
        manager.notify(NOTIFICATION_ID_TIMER, buildTimerNotification(time, isBreak))
    }

    fun notifyBreakFinished() {
        val notification = NotificationCompat.Builder(context, CHANNEL_ALARM_ID)
            .setContentTitle("Descanso terminou!")
            .setContentText("Hora de voltar pro foco.")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true)
            .build()
        manager.notify(NOTIFICATION_ID_ALARM, notification)
    }
}