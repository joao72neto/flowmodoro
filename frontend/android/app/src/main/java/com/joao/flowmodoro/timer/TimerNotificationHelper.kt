package com.joao.flowmodoro.timer

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.joao.flowmodoro.MainActivity
import com.joao.flowmodoro.R

class TimerNotificationHelper(private val context: Context) {

    companion object {
        const val CHANNEL_TIMER_ID = "flowmodoro_timer_v2"
        const val CHANNEL_BREAK_FINISHED_ID = "flowmodoro_break_finished_v2"
        const val NOTIFICATION_ID_TIMER = 1
        const val NOTIFICATION_ID_ALARM = 2
    }

    private val manager = context.getSystemService(NotificationManager::class.java)

    fun createChannels() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val timerChannel = NotificationChannel(
            CHANNEL_TIMER_ID, "Timer em andamento", NotificationManager.IMPORTANCE_HIGH
        ).apply {
            setSound(null, null)
        }

        val alarmChannel = NotificationChannel(
            CHANNEL_BREAK_FINISHED_ID, "Fim do descanso", NotificationManager.IMPORTANCE_HIGH
        ).apply {
            setSound(null, null)
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
            .setContentIntent(buildContentIntent())
            .build()
    }

    fun updateTimerNotification(time: String, isBreak: Boolean) {
        manager.notify(NOTIFICATION_ID_TIMER, buildTimerNotification(time, isBreak))
    }

    fun notifyBreakFinished() {
        val notification = NotificationCompat.Builder(context, CHANNEL_BREAK_FINISHED_ID)
            .setContentTitle("Descanso terminou!")
            .setContentText("Hora de voltar pro foco.")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true)
            .setContentIntent(buildContentIntent())
            .build()

        manager.notify(NOTIFICATION_ID_ALARM, notification)
    }

    private fun buildContentIntent(): PendingIntent {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        return PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or
                    PendingIntent.FLAG_IMMUTABLE
        )
    }
}