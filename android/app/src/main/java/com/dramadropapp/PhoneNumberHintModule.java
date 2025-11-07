package com.dramadropapp;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.auth.api.credentials.Credential;
import com.google.android.gms.auth.api.credentials.Credentials;
import com.google.android.gms.auth.api.credentials.CredentialsClient;
import com.google.android.gms.auth.api.credentials.HintRequest;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.ResolvableApiException;

public class PhoneNumberHintModule extends ReactContextBaseJavaModule {
    private static final int PHONE_NUMBER_HINT_REQUEST = 1001;
    private static final String MODULE_NAME = "PhoneNumberHint";
    private Promise phoneNumberPromise;
    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == PHONE_NUMBER_HINT_REQUEST) {
                if (resultCode == Activity.RESULT_OK && data != null) {
                    Credential credential = data.getParcelableExtra(Credential.EXTRA_KEY);
                    if (credential != null && phoneNumberPromise != null) {
                        phoneNumberPromise.resolve(credential.getId());
                        phoneNumberPromise = null;
                    }
                } else {
                    if (phoneNumberPromise != null) {
                        phoneNumberPromise.reject("CANCELLED", "User cancelled phone number selection");
                        phoneNumberPromise = null;
                    }
                }
            }
        }
    };

    public PhoneNumberHintModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(activityEventListener);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void getPhoneNumber(Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "No current activity");
            return;
        }

        phoneNumberPromise = promise;

        CredentialsClient credentialsClient = Credentials.getClient(currentActivity);
        HintRequest hintRequest = new HintRequest.Builder()
                .setPhoneNumberIdentifierSupported(true)
                .build();

        try {
            android.app.PendingIntent pendingIntent = credentialsClient.getHintPickerIntent(hintRequest);
            IntentSender intentSender = pendingIntent.getIntentSender();
            currentActivity.startIntentSenderForResult(
                    intentSender,
                    PHONE_NUMBER_HINT_REQUEST,
                    null,
                    0,
                    0,
                    0
            );
        } catch (IntentSender.SendIntentException e) {
            promise.reject("INTENT_ERROR", e.getMessage());
            phoneNumberPromise = null;
        }
    }
}

