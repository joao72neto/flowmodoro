package com.joao.flowmodoro;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.joao.flowmodoro.plugins.FlowmodoroPlugin;
import com.joao.flowmodoro.plugins.HelloPlugin;

import java.util.Arrays;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugins(Arrays.asList(
                HelloPlugin.class,
                FlowmodoroPlugin.class
        ));
        super.onCreate(savedInstanceState);
    }
}
