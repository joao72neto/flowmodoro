package com.joao.flowmodoro.plugins

import android.content.Intent
import android.os.Build
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.joao.flowmodoro.services.TimerService

@CapacitorPlugin(name = "Flowmodoro")
class FlowmodoroPlugin : Plugin() {

    @PluginMethod
    fun startTimer(call: PluginCall) {

        val intent = Intent(
            context,
            TimerService::class.java
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }

        call.resolve()
    }

    @PluginMethod
    fun stopTimer(call: PluginCall) {

        val intent = Intent(
            context,
            TimerService::class.java
        )

        context.stopService(intent)

        call.resolve()
    }
}