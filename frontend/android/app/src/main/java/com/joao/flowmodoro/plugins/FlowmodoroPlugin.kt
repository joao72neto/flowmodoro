package com.joao.flowmodoro.plugins

import android.Manifest
import android.content.Intent
import android.os.Build
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import com.joao.flowmodoro.services.TimerService

@CapacitorPlugin(
    name = "Flowmodoro", permissions = [
        Permission(strings = [Manifest.permission.POST_NOTIFICATIONS], alias = "notifications")
    ]
)
class FlowmodoroPlugin : Plugin() {

    @PluginMethod
    fun requestNotificationPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestPermissionForAlias("notifications", call, "notificationPermsCallback")
        } else {
            call.resolve()
        }
    }

    @PermissionCallback
    private fun notificationPermsCallback(call: PluginCall) {
        call.resolve()
    }

    @PluginMethod
    fun startFocus(call: PluginCall) {
        dispatch(Intent(context, TimerService::class.java).apply {
            action = TimerService.ACTION_START_FOCUS
        })
        call.resolve()
    }

    private fun PluginCall.getNumber(name: String): Long? {
        return getLong(name)
            ?: getInt(name)?.toLong()
            ?: getDouble(name)?.toLong()
    }

    @PluginMethod
    fun startBreak(call: PluginCall) {
        val focusDurationMillis = call.getNumber("focusDurationMillis")
        if (focusDurationMillis == null) {
            call.reject("focusDurationMillis é obrigatório")
            return
        }
        val ratio = call.getDouble("ratio") ?: 0.2

        dispatch(Intent(context, TimerService::class.java).apply {
            action = TimerService.ACTION_START_BREAK
            putExtra(TimerService.EXTRA_FOCUS_DURATION, focusDurationMillis)
            putExtra(TimerService.EXTRA_RATIO, ratio)
        })
        call.resolve()
    }

    @PluginMethod
    fun stopTimer(call: PluginCall) {
        val intent = Intent(context, TimerService::class.java).apply {
            action = TimerService.ACTION_STOP
        }
        context.startService(intent)
        call.resolve()
    }

    private fun dispatch(intent: Intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }
}