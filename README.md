# Image Optimization Api

AWS의 Dynamic Image Transformation for Amazon CloudFront 솔루션을 사용하여, 적은 비용으로 실시간 이미지 변환 및 최적화를 제공하는 API를 구성합니다.

## 주요 기능

- **간소화된 이미지 최적화**: 간단한 API 요청으로 실시간 이미지 변환 및 최적화를 수행합니다. 브라우저 기능에 맞춰 가장 효율적인 형식을 제공하고, 파일 크기와 품질을 최적화합니다.
- **확장 가능한 아키텍처**: 서버리스 아키텍처를 통해 다양한 부하를 자동으로 처리합니다. 인프라 관리 없이도 트래픽 급증 시 일관된 성능을 유지합니다.
- **비용 효율적인 스토리지 관리**: 원본 이미지만 저장하고 필요할 때 변형된 이미지를 생성합니다. 동일 이미지의 여러 버전이 필요 없어 스토리지 비용을 크게 절감합니다.
- **고급 보안 제어**: URL 서명, 요청 검증, 콘텐츠 조정 기능으로 시각적 자산을 보호하며, 이미지 전송에 대한 세분화된 접근 제어를 유지합니다.

## 빌드 및 배포

먼저, 배포할 AWS 리전을 설정합니다. `.env.region.example` 파일을 복사하여 `.env.region` 파일을 만들고 해당 리전 정보를 입력합니다. 예: `AWS_REGION=ap-northeast-2`

### 1. Uploader

Uploader를 배포하기 전에, `.env.uploader.example` 파일을 복사하여 `.env.uploader` 파일을 생성하고 필요한 환경 변수를 설정합니다.

```sh
npm run deploy:uploader
```

### 2. Transformer

Transformer를 배포하기 전에, `.env.transformer.example` 파일을 복사하여 `.env.transformer` 파일을 생성하고 필요한 환경 변수를 설정합니다.

```sh
npm run deploy:transformer
```

## 비용

미국 동부(버지니아 북부) 리전을 기준으로, 신규 이미지 100,000개를 처리할 경우 예상 월 비용은 약 5.30달러입니다.

## FAQ

### 사용자 정의 도메인(CNAME)을 CloudFront Distribution에 연결하는 방법

CloudFront Distribution에 사용자 정의 도메인(예: `image.yourdomain.com`)을 연결하려면 다음 단계를 따르세요.

1. AWS Management Console에서 CloudFront 서비스로 이동하여 해당 Distribution의 설정을 엽니다.
2. 'Settings' 섹션에서 'Edit'을 클릭하고, 'Alternate domain name (CNAME)' 필드에 사용하려는 사용자 정의 도메인을 입력합니다.
3. 'Custom SSL certificate' 섹션에서 해당 도메인에 맞는 SSL 인증서를 선택합니다. **중요:** CloudFront에서 사용자 정의 SSL 인증서를 사용하려면 반드시 `us-east-1` 리전에 생성된 인증서여야 합니다.
4. AWS Management Console에서 Route 53 서비스로 이동합니다.
5. 해당 도메인의 Hosted zone을 선택합니다.
6. 'Create record'를 클릭하여 새 레코드를 생성합니다. 레코드 유형은 'A'를 선택하고, 'Alias' 옵션을 활성화합니다. 'Route traffic to' 옵션에서 'Alias to CloudFront distribution'을 선택한 후, 해당 Distribution을 선택합니다. 마지막으로 'Create records'를 클릭하여 레코드를 생성합니다.
