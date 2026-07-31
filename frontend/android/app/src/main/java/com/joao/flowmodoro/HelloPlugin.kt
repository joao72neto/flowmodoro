package com.joao.flowmodoro;

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "Hello")
class HelloPlugin : Plugin() {

    @PluginMethod
    fun hello (call: PluginCall) {
        val ret = JSObject()
        ret.put("message", "Hello from Kotlin")
        call.resolve(ret)
    }

}
