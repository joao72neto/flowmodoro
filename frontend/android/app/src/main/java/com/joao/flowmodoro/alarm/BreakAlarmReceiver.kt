package com.joao.flowmodoro.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.joao.flowmodoro.services.TimerNotificationHelper
import com.joao.flowmodoro.services.TimerService

class BreakAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val notificationHelper = TimerNotificationHelper(context)
        notificationHelper.notifyBreakFinished()

        val stopIntent = Intent(context, TimerService::class.java).apply {
            action = TimerService.ACTION_STOP
        }

        context.startService(stopIntent)
    }
}