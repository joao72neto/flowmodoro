package com.joao.flowmodoro.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.util.Log

class BreakAlarmManager(
    private val context: Context
) {

    private val alarmManager =
        context.getSystemService(AlarmManager::class.java)

    fun schedule(anchor: Long, breakDurationMillis: Long) {
        val triggerAt = anchor + breakDurationMillis

        try {
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                triggerAt,
                pendingIntent()
            )
        } catch (e: SecurityException) {
            Log.e("BreakAlarmManager", "Não foi possível agendar alarme exato.", e)
        }
    }

    fun cancel() {
        alarmManager.cancel(pendingIntent())
    }

    private fun pendingIntent(): PendingIntent {
        val intent = Intent(context, BreakAlarmReceiver::class.java)

        return PendingIntent.getBroadcast(
            context,
            BREAK_ALARM_REQUEST_CODE,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    companion object {
        private const val BREAK_ALARM_REQUEST_CODE = 100
    }
}