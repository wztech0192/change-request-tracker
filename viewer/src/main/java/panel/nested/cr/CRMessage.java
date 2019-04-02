package panel.nested.cr;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import tool.CRTStyle;
import tool.HTTPController;
import tool.Loader;

/**
 * CRHistory
 */
public class CRMessage extends JPanel {
    private static final long serialVersionUID = 1L;
    private int id;
    private Loader loader = null;
    private HTTPController http = null;
    private JLabel lblHist = null;
    private String userName = null;

    public CRMessage(int id, Loader loader, HTTPController http, String userName) {
        this.id = id;
        this.loader = loader;
        this.http = http;
        this.userName = userName;
        setup();
    }

    // set component
    private void setup() {
        this.setLayout(new BorderLayout());
        this.setBackground(Color.WHITE);
        this.setBorder(BorderFactory.createMatteBorder(0, 2, 0, 2, Color.LIGHT_GRAY));
        this.lblHist = new JLabel();
        this.lblHist.setMaximumSize(new Dimension(450, 2000));
        this.lblHist.setVerticalAlignment(JLabel.TOP);

        JPanel subpane = new JPanel(new BorderLayout());

        subpane.add(new JScrollPane(lblHist), BorderLayout.CENTER);
        JTextArea textArea = new JTextArea("", 5, 5);
        subpane.add(textArea, BorderLayout.SOUTH);
        this.add(subpane, BorderLayout.CENTER);
        JButton send = new JButton("Send");
        send.addActionListener(e -> {
            http.sendMessage(id, textArea.getText());
            String oldText = lblHist.getText();
            // if the length is less than 13, send the first message. Else append
            String newText = "<html><div style='width:345px; border-bottom:1px solid gray; padding:10px;'><p style='font-size:11px'><b>"
                    + userName + " </b> <i> (Sending...) </i></p><p>" + textArea.getText() + "</p></div>";
            if (oldText.length() > 13) {
                oldText = oldText.substring(6, oldText.length());
                lblHist.setText(newText + oldText);
            } else {
                lblHist.setText(newText);
            }
            textArea.setText("");
        });
        send.setFont(CRTStyle.getFont());
        send.setBackground(CRTStyle.getBlue());
        send.setForeground(Color.WHITE);
        this.add(send, BorderLayout.SOUTH);

    }

    // start refresh
    public void start() {
        // active loader2
        loader.setActive(true, 1);
        Thread worker = new Thread(() -> {
            // loop if the current page is crpanel and cr history, else stop
            while (loader.isActive(0) && loader.isActive(1)) {
                try {
                    JSONArray jsonArr = http.getCRMessage(id);

                    if (jsonArr != null) {
                        String histHTML = "<html>";

                        for (int i = 0; i < jsonArr.length(); i++) {
                            JSONObject obj = jsonArr.getJSONObject(i);
                            String content = obj.get("content") + "";
                            if (content.equals("null"))
                                content = "";
                            histHTML += "<div style='width:345px; border-bottom:1px solid gray; padding:10px;'><p style='font-size:11px'><b>"
                                    + obj.getString("senderName") + " </b> <i> (" + obj.getString("created_at")
                                    + ") </i></p><div>" + content + "</div></div>";
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