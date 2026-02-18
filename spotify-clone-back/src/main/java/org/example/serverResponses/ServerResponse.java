package org.example.serverResponses;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class ServerResponse<T> {
    public String message;
    public T data;
}
