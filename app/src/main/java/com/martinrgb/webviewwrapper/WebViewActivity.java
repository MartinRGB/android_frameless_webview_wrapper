package com.martinrgb.webviewwrapper;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class WebViewActivity extends AppCompatActivity {

    public WebView mWebView;
    public String folderPath;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        deleteBars();
        getPathInfo();
        setContentView(R.layout.activity_webview);
        if(folderPath !=null){
            initWebView(folderPath);
        }
        setRefresh();
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mWebView != null) {
            mWebView = null;
        }
    }

    private void getPathInfo(){
        Bundle bundle = getIntent().getExtras();
        folderPath = bundle.getString("pathInfo").replace("/storage/emulated/0/", "");
    }

    private void initWebView(String folderStirng){

        mWebView = findViewById(R.id.mWebView);
        mWebView.loadUrl("file:///sdcard/"+ folderStirng + "/index.html");
        //Cross
        mWebView.getSettings().setAllowFileAccessFromFileURLs(true);
        mWebView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.getSettings().setAllowFileAccess(true);
        // Zoom
        mWebView.getSettings().setSupportZoom(false);
        mWebView.getSettings().setBuiltInZoomControls(false);
        // Autofit
        mWebView.getSettings().setUseWideViewPort(true);
        mWebView.getSettings().setLoadWithOverviewMode(true);
        // Performance
        mWebView.getSettings().setRenderPriority(WebSettings.RenderPriority.HIGH);
        mWebView.getSettings().setDomStorageEnabled(true);
        mWebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        mWebView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);

        mWebView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                return true;
            }
        });
        mWebView.setLongClickable(false);
        crossAlert();
    }

    private void crossAlert() {
        if (mWebView != null) {
            mWebView.setWebViewClient(new WebViewClient() {
                @Override
                public void onPageFinished(WebView view, String url) {
                    mWebView.loadUrl("javascript:dismissAlert()");
                }
            });
        }
    }

    private void deleteBars(){
        //Delete Title Bar
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        //Delete Action Bar
        getWindow().requestFeature(Window.FEATURE_ACTION_BAR);
        getSupportActionBar().hide();
    }

    private void setRefresh(){
        findViewById(R.id.mWebView).setOnTouchListener(new View.OnTouchListener() {
            SimpleTwoFingerDoubleTapDetector multiTouchListener = new SimpleTwoFingerDoubleTapDetector() {
                @Override
                public void onTwoFingerDoubleTap() {
                    Log.d("TEST", "onDoubleTap");
                    refreshWebView(folderPath);
                }
            };

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                Log.d("TEST", "Raw event: " + event.getAction() + ", (" + event.getRawX() + ", " + event.getRawY() + ")");
                multiTouchListener.onTouchEvent(event);
                return false;
            }
        });
    }

    private void refreshWebView(String folderStirng){
        mWebView.loadUrl("file:///sdcard/"+ folderStirng + "/index.html");
        crossAlert();

        Toast.makeText(WebViewActivity.this, "Web page refreshed！",
                Toast.LENGTH_SHORT).show();
    }

}
