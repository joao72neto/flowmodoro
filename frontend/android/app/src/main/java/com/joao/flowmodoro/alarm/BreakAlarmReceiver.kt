package com.joao.flowmodoro.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.net.Uri
import com.joao.flowmodoro.R
import com.joao.flowmodoro.services.TimerNotificationHelper
import com.joao.flowmodoro.services.TimerService

class BreakAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val notificationHelper = TimerNotificationHelper(context)
        notificationHelper.notifyBreakFinished()

        playAlarmSound(context)

        val stopIntent = Intent(context, TimerService::class.java).apply {
            action = TimerService.ACTION_STOP
        }
        context.startService(stopIntent)
    }

    private fun playAlarmSound(context: Context) {
        val alarmUri = Uri.parse("android.resource://${context.packageName}/${R.raw.alarm_sound}")

        MediaPlayer().apply {
            setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            )
            setDataSource(context, alarmUri)
            setOnCompletionListener { it.release() }
            prepare()
            start()
        }
    }
}