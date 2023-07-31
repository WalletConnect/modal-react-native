package com.installedapp

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod

class InstalledAppModule internal constructor(private val context: ReactApplicationContext) :
  InstalledAppSpec(context) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun isAppInstalled(packageName: String?, promise: Promise) {
    try {
        val installed = packageName?.let { isPackageInstalled(it) } ?: false
        promise.resolve(installed)
    } catch (e: Exception) {
        promise.resolve(false)
    }
  }

  private fun isPackageInstalled(packageName: String): Boolean {
    val manager: PackageManager = context.getPackageManager()
    return try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        manager.getPackageInfo(packageName, PackageManager.PackageInfoFlags.of(0))
      } else {
        @Suppress("DEPRECATION")
        manager.getPackageInfo(packageName, 0)
      }
      true
    } catch (e: PackageManager.NameNotFoundException) {
      false
    }
  }

  companion object {
    const val NAME = "InstalledApp"
  }
}
