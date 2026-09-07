package com.joao.flowmodoro.timer

import java.util.Locale

object TimeFormatter {
    fun format(elapsedMillis: Long): String {
        val totalSeconds = Math.max(0L, elapsedMillis) / 1000

        val hours = totalSeconds / 3600
        val minutes = (totalSeconds % 3600) / 60
        val seconds = totalSeconds % 60

        if (hours > 0) {
            return String.format(Locale.ROOT, "%02d:%02d:%02d", hours, minutes, seconds)
        }

        return String.format(Locale.ROOT, "%02d:%02d", minutes, seconds)
    }

    fun formatCountdown(remainingMillis: Long): String {
        val totalSeconds = Math.max(0L, remainingMillis)
            .plus(500)
            .div(1000)

        val hours = totalSeconds / 3600
        val minutes = (totalSeconds % 3600) / 60
        val seconds = totalSeconds % 60

        if (hours > 0) {
            return String.format(Locale.ROOT, "%02d:%02d:%02d", hours, minutes, seconds)
        }

        return String.format(Locale.ROOT, "%02d:%02d", minutes, seconds)
    }
}