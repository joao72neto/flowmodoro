package com.joao.flowmodoro

import android.app.Application
import com.joao.flowmodoro.timer.TimerNotificationHelper

class FlowmodoroApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        TimerNotificationHelper(this).createChannels()
    }
}
