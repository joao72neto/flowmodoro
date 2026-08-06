package com.joao.flowmodoro

import android.Manifest
import android.app.AlarmManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import com.getcapacitor.JSObject
import com.getcapacitor.PermissionState
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

    private val alarmManager: AlarmManager
        get() = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    @PluginMethod
    fun ensureNotificationPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            call.resolve(JSObject().apply {
                put("granted", true)
            })
            return
        }

        if (getPermissionState("notifications") == PermissionState.GRANTED) {
            call.resolve(JSObject().apply {
                put("granted", true)
            })
            return
        }

        requestPermissionForAlias("notifications", call, "notificationPermsCallback")
    }

    @PermissionCallback
    private fun notificationPermsCallback(call: PluginCall) {
        call.resolve(JSObject().apply {
            put(
                "granted",
                getPermissionState("notifications") == PermissionState.GRANTED
            )
        })
    }

    @PluginMethod
    fun ensureExactAlarmPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            call.resolve(JSObject().apply {
                put("granted", true)
            })
            return
        }

        if (alarmManager.canScheduleExactAlarms()) {
            call.resolve(JSObject().apply {
                put("granted", true)
            })
            return
        }

        val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }

        context.startActivity(intent)

        call.resolve(JSObject().apply {
            put("granted", false)
        })
    }

    @PluginMethod
    fun ensureBatteryOptimization(call: PluginCall) {
        val powerManager =
            context.getSystemService(Context.POWER_SERVICE) as PowerManager

        if (powerManager.isIgnoringBatteryOptimizations(context.packageName)) {
            call.resolve(JSObject().apply {
                put("granted", true)
            })
            return
        }

        val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
            data = Uri.parse("package:${context.packageName}")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }

        context.startActivity(intent)

        call.resolve(JSObject().apply {
            put("granted", false)
        })
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

    private fun PluginCall.getNumber(name: String): Long? {
        return getLong(name) ?: getInt(name)?.toLong() ?: getDouble(name)?.toLong()
    }

    private fun dispatch(intent: Intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }
}