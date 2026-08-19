package com.joao.flowmodoro.timer

import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.net.Uri
import android.os.IBinder
import android.os.PowerManager
import android.util.Log
import kotlinx.coroutines.*
import com.joao.flowmodoro.R
import com.joao.flowmodoro.alarm.AlarmManager

class TimerService : Service() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var tickerJob: Job? = null
    private lateinit var notificationHelper: TimerNotificationHelper
    private lateinit var alarmManager: AlarmManager

    private var mediaPlayer: MediaPlayer? = null
    private var wakeLock: PowerManager.WakeLock? = null

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

            ACTION_BREAK_FINISHED -> handleBreakFinished()
            ACTION_STOP -> stopTimer()
            else -> stopSelf()
        }
        return START_STICKY
    }

    private fun startFocus(anchor: Long) {
        stopAlarmSound()
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
        stopAlarmSound()
        tickerJob?.cancel()

        val breakDuration = calculateBreakTime(totalFocus, restRatio)

        alarmManager.schedule(anchor, breakDuration)

        tickerJob = serviceScope.launch {
            while (isActive) {
                val elapsed = System.currentTimeMillis() - anchor
                val remaining = breakDuration - elapsed

                if (remaining <= 0) break

                notificationHelper.updateTimerNotification(
                    TimeFormatter.formatCountdown(remaining),
                    true
                )

                delay(1000)
            }
        }
    }

    private fun calculateBreakTime(totalFocusMillis: Long, restRatio: Double): Long {
        val calculatedBreak = kotlin.math.round(totalFocusMillis * restRatio).toLong()

        return when (restRatio) {
            0.1 -> minOf(calculatedBreak, 600_000)
            0.2 -> minOf(calculatedBreak, 900_000)
            0.3 -> minOf(calculatedBreak, 1_200_000)
            else -> calculatedBreak
        }
    }

    private fun handleBreakFinished() {
        tickerJob?.cancel()
        notificationHelper.notifyBreakFinished()

        playAlarmSound {
            stopTimer()
        }
    }

    private fun playAlarmSound(onComplete: () -> Unit) {
        stopAlarmSound()

        try {
            val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
            wakeLock = powerManager.newWakeLock(
                PowerManager.PARTIAL_WAKE_LOCK,
                "Flowmodoro:AlarmSoundWakeLock"
            ).apply {
                acquire(30000)
            }

            val alarmUri = Uri.parse("android.resource://$packageName/${R.raw.alarm_sound}")

            mediaPlayer = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                setDataSource(applicationContext, alarmUri)
                setOnCompletionListener {
                    releaseMediaPlayer()
                    onComplete()
                }
                setOnErrorListener { _, what, extra ->
                    Log.e("TimerService", "MediaPlayer error: what=$what, extra=$extra")
                    releaseMediaPlayer()
                    onComplete()
                    true
                }
                prepare()
                start()
            }
        } catch (e: Exception) {
            Log.e("TimerService", "Error playing alarm sound", e)
            releaseMediaPlayer()
            onComplete()
        }
    }

    private fun releaseMediaPlayer() {
        try {
            mediaPlayer?.let {
                if (it.isPlaying) {
                    it.stop()
                }
                it.release()
            }
        } catch (e: Exception) {
            Log.e("TimerService", "Error releasing MediaPlayer", e)
        } finally {
            mediaPlayer = null
        }

        try {
            wakeLock?.let {
                if (it.isHeld) {
                    it.release()
                }
            }
        } catch (e: Exception) {
            Log.e("TimerService", "Error releasing WakeLock", e)
        } finally {
            wakeLock = null
        }
    }

    private fun stopAlarmSound() {
        releaseMediaPlayer()
    }

    private fun stopTimer() {
        stopAlarmSound()
        tickerJob?.cancel()
        alarmManager.cancel()
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    override fun onDestroy() {
        stopAlarmSound()
        serviceScope.cancel()
        super.onDestroy()
    }

    override fun onBind(p0: Intent?): IBinder? = null

    companion object {
        const val EXTRA_ANCHOR = "extra_anchor"
        const val ACTION_START_FOCUS = "com.joao.flowmodoro.action.START_FOCUS"
        const val ACTION_START_BREAK = "com.joao.flowmodoro.action.START_BREAK"
        const val ACTION_BREAK_FINISHED = "com.joao.flowmodoro.action.BREAK_FINISHED"
        const val ACTION_STOP = "com.joao.flowmodoro.action.STOP"
        const val EXTRA_TOTAL_FOCUS = "extra_total_focus"
        const val EXTRA_REST_RATIO = "extra_rest_ratio"
    }
}
