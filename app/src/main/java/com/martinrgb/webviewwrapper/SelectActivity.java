package com.martinrgb.webviewwrapper;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import ru.bartwell.exfilepicker.ExFilePicker;
import ru.bartwell.exfilepicker.data.ExFilePickerResult;

public class SelectActivity extends AppCompatActivity {

    private static final int FOLDER_PICKER_RESULT = 0;
    private ExFilePicker mExFilePicker;
    public static String folderPath;
    public static String folderName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        deleteBars();
        setContentView(R.layout.activity_select);
        requestAppPermissions();
        initPicker();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }


    public void deleteBars(){
        //Delete Title Bar
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        //Delete Action Bar
        getWindow().requestFeature(Window.FEATURE_ACTION_BAR);
        getSupportActionBar().hide();
    }

    private void requestAppPermissions() {
        if (android.os.Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            return;
        }

        if (hasReadPermissions() && hasWritePermissions()) {
            return;
        }

        ActivityCompat.requestPermissions(this,
                new String[] {
                        Manifest.permission.READ_EXTERNAL_STORAGE,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE
                }, 0); // your request code
    }

    private boolean hasReadPermissions() {
        return (ContextCompat.checkSelfPermission(getBaseContext(), Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED);
    }

    private boolean hasWritePermissions() {
        return (ContextCompat.checkSelfPermission(getBaseContext(), Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED);
    }

    private void initPicker(){
        mExFilePicker = new ExFilePicker();
        mExFilePicker.setCanChooseOnlyOneItem(true);
        mExFilePicker.setQuitButtonEnabled(true);
    }

    public void selectWebView(View view){
        mExFilePicker.setChoiceType(ExFilePicker.ChoiceType.DIRECTORIES);
        mExFilePicker.start(this,FOLDER_PICKER_RESULT);
    }

    public void selectDefault(View view){
        transitionToWebViewActivity("Download/Effect");
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {


        if (requestCode == FOLDER_PICKER_RESULT) {
            ExFilePickerResult result = ExFilePickerResult.getFromIntent(data);
            if (result != null && result.getCount() > 0) {
                StringBuilder stringBuilder = new StringBuilder();
                stringBuilder.append(result.getNames().get(0));
                folderName = stringBuilder.toString();
                folderPath = result.getPath() + folderName;

                //FrameWallpaper.setToWallPaper(this);
                Log.e("PATH",folderPath);
                Log.e("NAME",folderName);

                transitionToWebViewActivity(folderPath);
            }
        }

    }

    private void transitionToWebViewActivity(String string){
        Intent intent = new Intent(SelectActivity.this, WebViewActivity.class);
        intent.putExtra("pathInfo", string);
        startActivity(intent);
    }
}
