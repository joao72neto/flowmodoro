package com.joao.flowmodoro;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.joao.flowmodoro.plugins.FlowmodoroPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(FlowmodoroPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
