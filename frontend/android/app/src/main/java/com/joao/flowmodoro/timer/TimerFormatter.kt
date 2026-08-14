package com.joao.flowmodoro.timer

import java.util.Locale

object TimeFormatter {
    fun format(elapsedMillis: Long): String {
        val totalSeconds = Math.max(0L, elapsedMillis) / 1000
        val minutes = totalSeconds / 60
        val seconds = totalSeconds % 60
        return String.format(Locale.ROOT, "%02d:%02d", minutes, seconds)
    }

    fun formatCountdown(remainingMillis: Long): String {
        val totalSeconds = Math.max(0L, remainingMillis + 999) / 1000
        val minutes = totalSeconds / 60
        val seconds = totalSeconds % 60
        return String.format(Locale.ROOT, "%02d:%02d", minutes, seconds)
    }
}
