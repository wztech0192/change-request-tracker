package tool;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * HTTP
 */
public class HTTPController {

    private String token = null;
    private String baseURL = null;

    // pre-define token
    public HTTPController(String baseURL, String token) {
    }

    // set http request
    public HTTPController() {

    }

    // get token
    public String getToken() {
        return token;
    }

    // set token
    public void setToken(String token) {
        this.token = token;
    }

    // return base url;
    public String getBaseURL() {
        return this.baseURL;
    }

    // set url
    public void setBaseURL(String url) {
        this.baseURL = url;
    }

    // http request
    private Response HTTP(String method, String route, Boolean hasToken, String body) {
        int status = 500;
        try {
            URL obj = new URL(baseURL + route);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            // request method
            con.setRequestMethod(method);

            if (hasToken) {
                // set header with jwt token
                con.setRequestProperty("Authorization", "Bearer " + token);
            }

            if (body != null) {
                con.setRequestProperty("Content-Type", "application/json");
                // post request body
                con.setDoOutput(true);
                DataOutputStream wr = new DataOutputStream(con.getOutputStream());
                wr.writeBytes(body);
                wr.flush();
                wr.close();
            }

            // get status;
            status = con.getResponseCode();
            // read response body
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            return new Response(status, response.toString());

        } catch (IOException e) {
            return new Response(status, "Something is wrong");
        }
    }

    // clear token
    public void clearToken() {
        this.token = null;
    }

    // take email and password to set token. Return status.
    public int login(String email, String password) {
        String body = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
        // post
        Response response = HTTP("POST", "auth/login", false, body);

        if (response.getStatus() == 200) {
            // pase json and set token
            try {
                JSONObject json = new JSONObject(response.getJsonSTR());
                this.token = (String) json.get("token");
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return response.getStatus();
    }

    // get current user information
    public Response getUser() {

        // get
        Response response = HTTP("GET", "user", true, null);
        if (response.getStatus() == 200) {
            // pase json and set token
            try {
                JSONObject json = new JSONObject(response.getJsonSTR());
                response.setJson(json);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return response;
    }

    // get change request list
    public Object[][] getCRList(String tab, Boolean isAdmin) {
        String route = isAdmin ? "change-request/admin/list" : "change-request/list";
        String body = "{\"method\":\"tab\",\"tab\":\"" + tab + "\"}";
        // post
        Response response = HTTP("POST", route, true, body);

        if (response.getStatus() == 200) {
            // pase json and set token
            try {
                JSONArray jsonArr = new JSONArray(response.getJsonSTR());
                Object[][] data = new Object[jsonArr.length()][isAdmin ? 4 : 3];
                for (int i = 0; i < jsonArr.length(); i++) {
                    JSONObject obj = jsonArr.getJSONObject(i);
                    data[i][0] = obj.get("id");
                    if (isAdmin) {
                        data[i][1] = obj.get("clientName");
                        data[i][2] = obj.get("status");
                        data[i][3] = obj.get("created_at");
                    } else {
                        data[i][1] = obj.get("status");
                        data[i][2] = obj.get("created_at");
                    }
                }
                return data;
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    // get change request detail by id
    public Response getCRDetail(int id) {
        // get
        Response response = HTTP("GET", "change-request/" + id, true, null);
        if (response.getStatus() == 200) {
            // pase json and set token
            try {
                JSONObject json = new JSONObject(response.getJsonSTR());
                response.setJson(json);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return response;
    }

    // update change request status
    public Response updateStatus(int id, String newStatus) {
        String body = "{\"status\":\"" + newStatus + "\"}";
        // patch
        Response response = HTTP("PUT", "change-request/" + id, true, body);

        if (response.getStatus() == 200) {
            // pase json and set token
            try {
                JSONObject json = new JSONObject(response.getJsonSTR());
                response.setJson(json);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return response;
    }

    // get change request history
    public JSONArray getCRHistory(int id) {
        // patch
        Response response = HTTP("GET", "change-request/" + id + "/hist", true, null);
        JSONArray jsonArr = null;
        if (response.getStatus() == 200) {
            // pase json and set token
            try {
                jsonArr = new JSONArray(response.getJsonSTR());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return jsonArr;
    }

    // get change request message
    public JSONArray getCRMessage(int id) {
        // patch
        Response response = HTTP("GET", "change-request/" + id + "/msg/20", true, null);
        JSONArray jsonArr = null;
        if (response.getStatus() == 200) {
            // pase json and set token
            try {
                jsonArr = new JSONArray(response.getJsonSTR());
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return jsonArr;
    }

    // send change request message
    public void sendMessage(int id, String msg) {
        String body = "{\"content\":\"" + "<p>" + msg + "</p>" + "\"}";
        // post
        HTTP("POST", "change-request/" + id + "/msg", true, body);

    }

}