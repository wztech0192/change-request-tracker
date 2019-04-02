package panel.nested.cr;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;

import javax.swing.BorderFactory;
import javax.swing.JLabel;
import javax.swing.JPanel;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import tool.HTTPController;
import tool.Loader;

/**
 * CRHistory
 */
public class CRHistory extends JPanel {
    private static final long serialVersionUID = 1L;
    private int id;
    private Loader loader = null;
    private HTTPController http = null;
    private JLabel lblHist = null;

    public CRHistory(int id, Loader loader, HTTPController http) {
        this.id = id;
        this.loader = loader;
        this.http = http;
        setup();
    }

    // set component
    private void setup() {
        this.setLayout(new BorderLayout());
        this.setBackground(Color.WHITE);
        this.setBorder(BorderFactory.createMatteBorder(0, 2, 0, 2, Color.LIGHT_GRAY));
        this.lblHist = new JLabel();
        this.lblHist.setMaximumSize(new Dimension(440, 2000));
        this.lblHist.setVerticalAlignment(JLabel.TOP);
        this.add(lblHist, BorderLayout.CENTER);
    }

    // start refresh
    public void start() {
        // active loader2
        loader.setActive(true, 2);
        Thread worker = new Thread(() -> {
            // loop if the current page is crpanel and cr history, else stop
            while (loader.isActive(0) && loader.isActive(2)) {
                try {
                    JSONArray jsonArr = http.getCRHistory(id);

                    if (jsonArr != null) {
                        String histHTML = "<html>";

                        for (int i = 0; i < jsonArr.length(); i++) {
                            JSONObject obj = jsonArr.getJSONObject(i);
                            histHTML += "<div style='width:342px; border-bottom:1px solid gray; padding:10px;'><p style='font-size:11px;margin-bottom:3px;'><b>"
                                    + obj.get("type") + " </b> <i> (" + obj.getString("created_at").split(" ")[0]
                                    + ") </i></p><p>" + obj.get("content") + "</p></div>";
                        }
                        lblHist.setText(histHTML + "</html>");

                    }
                    // sleep for 2 seconds
                    Thread.sleep(2000);
                } catch (JSONException | InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        worker.start();
    }

}