package org.example.serverResponses;

import lombok.AllArgsConstructor;
import lombok.Builder;

@AllArgsConstructor
public class ServerResponse<T> {
    public boolean success;
    public String message;
    public T data;

}
