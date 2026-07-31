package com.joao.flowmodoro;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(HelloPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
