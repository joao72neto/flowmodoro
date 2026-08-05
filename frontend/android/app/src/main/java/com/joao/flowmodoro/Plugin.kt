package com.joao.flowmodoro

import android.Manifest
import android.content.Intent
import android.os.Build
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import com.joao.flowmodoro.timer.TimerService

@CapacitorPlugin(
    name = "Flowmodoro", permissions = [
        Permission(strings = [Manifest.permission.POST_NOTIFICATIONS], alias = "notifications")
    ]
)
class Plugin : Plugin() {

    @PluginMethod
    fun requestNotificationPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestPermissionForAlias("notifications", call, "notificationPermsCallback")
        } else {
            call.resolve()
        }
    }

    @PluginMethod
    fun startFocus(call: PluginCall) {
        val anchorMillis = call.getNumber("anchorMillis") ?: System.currentTimeMillis()
        dispatch(Intent(context, TimerService::class.java).apply {
            action = TimerService.ACTION_START_FOCUS
            putExtra(TimerService.EXTRA_ANCHOR, anchorMillis)
        })
        call.resolve()
    }

    @PluginMethod
    fun startBreak(call: PluginCall) {
        val restDurationMillis = call.getNumber("restDurationMillis")
            ?: return call.reject("restDurationMillis é obrigatório")
        val anchorMillis = call.getNumber("anchorMillis") ?: System.currentTimeMillis()

        dispatch(Intent(context, TimerService::class.java).apply {
            action = TimerService.ACTION_START_BREAK
            putExtra(TimerService.EXTRA_REST_DURATION, restDurationMillis)
            putExtra(TimerService.EXTRA_ANCHOR, anchorMillis)
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

    @PermissionCallback
    private fun notificationPermsCallback(call: PluginCall) {
        call.resolve()
    }

    private fun PluginCall.getNumber(name: String): Long? {
        return getLong(name)
            ?: getInt(name)?.toLong()
            ?: getDouble(name)?.toLong()
    }

    private fun dispatch(intent: Intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }
}