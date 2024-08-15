package com.ssafy.BOSS.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.IOUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class S3UploadService {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public String upload(MultipartFile image) {
        //입력받은 이미지 파일이 빈 파일인지 검증
        validateEmptyImage(image);
        //uploadImage를 호출하여 S3에 저장된 이미지의 public url을 반환한다.
        return this.uploadImage(image);
    }

    public String upload(MultipartFile image, int var) {
        //입력받은 이미지 파일이 빈 파일인지 검증
        validateEmptyImage(image);
        //uploadImage를 호출하여 S3에 저장된 이미지의 public url을 반환한다.
        return this.uploadImage(image, var);
    }

    private void validateEmptyImage(MultipartFile image) {
        if (image.isEmpty() || Objects.isNull(image.getOriginalFilename())) {
            throw new MultipartException("파일이 비었음. " + image.getOriginalFilename());
        }
    }

    private String uploadImage(MultipartFile image) {
        validateImageFileExtension(image.getOriginalFilename());
        try {
            return this.uploadImageToS3(image);
        } catch (IOException e) {
            throw new MultipartException(image.getOriginalFilename());
        }
    }

    private String uploadImage(MultipartFile image, int var) {
        validateImageFileExtension(image.getOriginalFilename());
        try {
            return this.uploadImageToS3(image, var);
        } catch (IOException e) {
            throw new MultipartException(image.getOriginalFilename());
        }
    }

    private void validateImageFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            throw new MultipartException("파일 이름 없음. " + filename);
        }

        String extension = filename.substring(lastDotIndex + 1).toLowerCase();
        List<String> allowedExtentionList = Arrays.asList("jpg", "jpeg", "png", "gif");

        if (!allowedExtentionList.contains(extension)) {
            throw new MultipartException("파일형식오류! " + filename);
        }
    }

    private String uploadImageToS3(MultipartFile image) throws IOException {
        String originalFilename = image.getOriginalFilename(); //원본 파일 명
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); //확장자 명

        String s3FileName = UUID.randomUUID().toString().substring(0, 10) + originalFilename; //변경된 파일 명

        InputStream is = image.getInputStream();
        byte[] bytes = IOUtils.toByteArray(is); //image를 byte[]로 변환

        ObjectMetadata metadata = new ObjectMetadata(); //metadata 생성
        metadata.setContentType("image/" + extension);
        metadata.setContentLength(bytes.length);

        //S3에 요청할 때 사용할 byteInputStream 생성
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

        try {
            //S3로 putObject 할 때 사용할 요청 객체
            //생성자 : bucket 이름, 파일 명, byteInputStream, metadata
            PutObjectRequest putObjectRequest =
                    new PutObjectRequest(bucketName, s3FileName, byteArrayInputStream, metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead);

            //실제로 S3에 이미지 데이터를 넣는 부분이다.
            amazonS3.putObject(putObjectRequest); // put image to S3
        } catch (Exception e) {
            System.out.println(amazonS3.getUrl(bucketName, s3FileName).toString());
            e.printStackTrace();
            throw new MultipartException("S3 넣기 실패!: " + originalFilename);
        } finally {
            byteArrayInputStream.close();
            is.close();
        }

        String url = amazonS3.getUrl(bucketName, s3FileName).toString();
        String cdn = "https://d3vud5llnd72x5.cloudfront.net/" + url.split("/")[url.split("/").length - 1];

        return cdn;
    }

    private String uploadImageToS3(MultipartFile image, int var) throws IOException {
        String originalFilename = image.getOriginalFilename(); //원본 파일 명
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); //확장자 명

        String s3FileName = UUID.randomUUID().toString().substring(0, 10) + originalFilename; //변경된 파일 명

        InputStream is = image.getInputStream();
        byte[] bytes = IOUtils.toByteArray(is); //image를 byte[]로 변환

        //S3에 요청할 때 사용할 byteInputStream 생성
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        Thumbnails.of(byteArrayInputStream)
                .size(200, 300)
                .keepAspectRatio(false)
                .toOutputStream(os);

        byte[] compressedImage = os.toByteArray();
        ByteArrayInputStream uploadInputStream = new ByteArrayInputStream(compressedImage);

        ObjectMetadata metadata = new ObjectMetadata(); //metadata 생성
        metadata.setContentType("image/" + extension);
        metadata.setContentLength(compressedImage.length);

        try {
            //S3로 putObject 할 때 사용할 요청 객체
            //생성자 : bucket 이름, 파일 명, byteInputStream, metadata
            PutObjectRequest putObjectRequest =
                    new PutObjectRequest(bucketName, s3FileName, uploadInputStream, metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead);

            //실제로 S3에 이미지 데이터를 넣는 부분이다.
            amazonS3.putObject(putObjectRequest); // put image to S3
        } catch (Exception e) {
            System.out.println(amazonS3.getUrl(bucketName, s3FileName).toString());
            e.printStackTrace();
            throw new MultipartException("S3 넣기 실패!: " + originalFilename);
        } finally {
            byteArrayInputStream.close();
            is.close();
        }

        String url = amazonS3.getUrl(bucketName, s3FileName).toString();
        String cdn = "https://d3vud5llnd72x5.cloudfront.net/" + url.split("/")[url.split("/").length - 1];

        return cdn;
    }
}
