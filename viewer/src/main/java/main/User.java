package main;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * User
 */
public class User {
    String full_name;
    String email;
    String first_name;
    String last_name;
    String created_at;
    String updated_at;
    int totalRequest;
    String role;

    public User(String full_name, String email, String first_name, String last_name, String role, String created_at,
            String updated_at, int totalRequest) {
        this.full_name = full_name;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.totalRequest = totalRequest;
        this.role = role;
    }

    public User(JSONObject json) {
        try {
            this.full_name = (String) json.get("full_name");
            this.email = (String) json.get("email");
            this.first_name = (String) json.get("first_name");
            this.last_name = (String) json.get("last_name");
            this.created_at = (String) json.get("created_at");
            this.updated_at = (String) json.get("updated_at");
            this.totalRequest = (int) json.get("totalRequest");
            this.role = (String) json.get("role");
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * @return the created_at
     */
    public String getCreatedAt() {
        return created_at;
    }

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @return the first_name
     */
    public String getFirstName() {
        return first_name;
    }

    /**
     * @return the full_name
     */
    public String getFullName() {
        return full_name;
    }

    /**
     * @return the last_name
     */
    public String getLastName() {
        return last_name;
    }

    /**
     * @return the role
     */
    public String getRole() {
        return role;
    }

    /**
     * @return the totalRequest
     */
    public int getTotalRequest() {
        return totalRequest;
    }

    /**
     * @return the updated_at
     */
    public String getUpdatedAt() {
        return updated_at;
    }

    public Boolean isAdmin() {
        return role.equalsIgnoreCase("Admin") || role.equalsIgnoreCase("Developer");
    }

    public Boolean isDev() {
        return role.equalsIgnoreCase("Developer");
    }

}