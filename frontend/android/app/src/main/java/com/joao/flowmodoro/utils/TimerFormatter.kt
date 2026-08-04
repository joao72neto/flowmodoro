package com.joao.flowmodoro.utils

import java.util.Locale


object TimeFormatter {
    fun format(elapsedMillis: Long): String {
        val totalSeconds = elapsedMillis / 1000
        val minutes = totalSeconds / 60
        val seconds = totalSeconds % 60
        return String.format(Locale.ROOT, "%02d:%02d", minutes, seconds)
    }
}