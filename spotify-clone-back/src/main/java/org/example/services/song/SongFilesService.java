package org.example.services.song;

import org.example.dtos.song.AudioFileDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ws.schild.jave.Encoder;
import ws.schild.jave.MultimediaObject;
import ws.schild.jave.encode.AudioAttributes;
import ws.schild.jave.encode.EncodingAttributes;
import ws.schild.jave.process.ffmpeg.DefaultFFMPEGLocator;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class SongFilesService {
    @Value("${music.dir}")
    private String uploadDir;

    String extension = "mp3";

    public AudioFileDTO load(MultipartFile file){
        if(file.isEmpty()) return null;
        try(var inputStream = file.getInputStream()){
            return saveStreamToFile(inputStream);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    public AudioFileDTO saveStreamToFile(InputStream inputStream) throws IOException{
        Files.createDirectories(Paths.get(uploadDir));
        String fileName = UUID.randomUUID().toString() + "." + extension;
        Path filePath = Paths.get(uploadDir,fileName);

        String tempFileName = UUID.randomUUID().toString() + ".tmp";
        Path tempPath = Paths.get(uploadDir, tempFileName);
        Files.copy(inputStream, tempPath);
        try{
            AudioAttributes audio = new AudioAttributes();
            audio.setCodec("libmp3lame");
            audio.setBitRate(128000);
            audio.setChannels(2);
            audio.setSamplingRate(44100);

            EncodingAttributes attrs = new EncodingAttributes();
            attrs.setOutputFormat("mp3");
            attrs.setAudioAttributes(audio);

            Encoder encoder = new Encoder();
            var multimediaObj = new MultimediaObject(tempPath.toFile());
            encoder.encode(multimediaObj, filePath.toFile(), attrs);

            AudioFileDTO dto = new AudioFileDTO();
            dto.setFileName(fileName);
            dto.setDuration(multimediaObj.getInfo().getDuration() / 1000);

            delete(tempFileName);
            return dto;

        }catch (Exception e){
            System.out.println(e.getMessage());
            return null;
        }finally {
            Files.deleteIfExists(tempPath);
        }

    }

    public void delete(String fileName){
        Path filePath = Paths.get(uploadDir,fileName);
        try{
            Files.deleteIfExists(filePath);

        }catch (IOException e){
            System.out.println(e.getMessage());
        }
    }
}
