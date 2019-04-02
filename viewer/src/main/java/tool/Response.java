package tool;

import org.json.JSONObject;

public final class Response {
    private int status;
    private String jsonSTR;
    private JSONObject json;

    Response(int status, String jsonSTR) {
        this.status = status;
        this.jsonSTR = jsonSTR;
    }

    /**
     * @param json the json to set
     */
    public void setJson(JSONObject json) {
        this.json = json;
    }

    /**
     * @return the json
     */
    public JSONObject getJson() {
        return json;
    }

    /**
     * @return the status
     */
    public int getStatus() {
        return status;
    }

    /**
     * @return the jsonSTR
     */
    public String getJsonSTR() {
        return jsonSTR;
    }

}
