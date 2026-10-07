package engine.spider.atila

import android.app.Activity
import android.os.Build
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import org.json.JSONObject

class MainActivity : Activity() {
 override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)

  val box = LinearLayout(this).apply {
   orientation = LinearLayout.VERTICAL
   setPadding(32, 32, 32, 32)
  }
  val title = TextView(this).apply {
   text = "ATTILA + NEO-ATTILA"
   textSize = 22f
  }
  val status = TextView(this).apply {
   text = "Pret pour le diagnostic local."
  }
  val scan = Button(this).apply {
   text = "Lancer le diagnostic"
  }

  scan.setOnClickListener {
   val report = JSONObject()
    .put("protocol", "ATTILA_NEO_LOCAL_SCAN_V1")
    .put("manufacturer", Build.MANUFACTURER)
    .put("model", Build.MODEL)
    .put("android", Build.VERSION.RELEASE)
    .put("security_patch", Build.VERSION.SECURITY_PATCH)
    .put("sdk", Build.VERSION.SDK_INT)
    .put("automatic_deletion", false)
    .put("remote_retaliation", false)

   getSharedPreferences("atila_local", MODE_PRIVATE)
    .edit().putString("last_scan", report.toString()).apply()

   status.text = report.toString(2)
  }

  box.addView(title)
  box.addView(scan)
  box.addView(status)
  setContentView(ScrollView(this).apply { addView(box) })
 }
}
