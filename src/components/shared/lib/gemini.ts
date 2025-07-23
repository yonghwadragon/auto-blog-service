// auto-blog-service/src/components/lib/gemini.ts
// Gemini API 유틸리티: Gemini 모델과 상호작용하기 위한 함수들을 정의합니다.

// Gemini API 연동 서비스

interface GeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

interface GenerateContentRequest {
  title: string;
  description?: string;
  category?: string;
  keywords?: string[];
  images?: string[]; // base64 encoded images
  tone?: 'formal' | 'casual' | 'professional' | 'friendly' | 'humorous';
  length?: 'short' | 'medium' | 'long';
  includeImages?: boolean;
}

interface GenerateContentResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class GeminiService {
  private config: GeminiConfig;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(config: GeminiConfig) {
    this.config = {
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxOutputTokens: 2048,
      ...config
    };
  }

  /**
   * 블로그 콘텐츠 자동 생성
   */
  async generateBlogContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
    try {
      const prompt = this.buildPrompt(request);
      const response = await this.callGeminiAPI(prompt, request.images);
      
      if (!response.success) {
        return response;
      }

      // HTML 형식으로 변환
      const htmlContent = this.formatToHtml(response.content!, request);
      
      return {
        success: true,
        content: htmlContent,
        usage: response.usage
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 이미지 분석 및 설명 생성
   */
  async analyzeImage(imageBase64: string): Promise<GenerateContentResponse> {
    try {
      const prompt = `이 이미지를 분석하고 블로그 포스트에 적합한 설명을 작성해주세요. 
      다음 사항을 포함해주세요:
      1. 이미지의 주요 내용
      2. 시각적 특징
      3. 블로그 독자들이 관심을 가질 만한 포인트
      
      한국어로 자연스럽게 작성해주세요.`;

      const response = await this.callGeminiAPI(prompt, [imageBase64]);
      return response;
    } catch (error) {
      console.error('Image Analysis Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '이미지 분석 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 제목 제안 생성
   */
  async suggestTitles(description: string, count: number = 5): Promise<string[]> {
    try {
      const prompt = `다음 설명을 바탕으로 매력적인 블로그 제목을 ${count}개 제안해주세요:
      "${description}"
      
      요구사항:
      - 클릭을 유도하는 매력적인 제목
      - SEO에 효과적인 키워드 포함
      - 30자 이내로 간결하게
      - 각 제목은 번호 없이 새 줄로 구분
      
      예시:
      놀라운 결과를 만드는 간단한 방법
      전문가가 알려주는 핵심 포인트
      초보자도 쉽게 따라하는 가이드`;

      const response = await this.callGeminiAPI(prompt);
      
      if (response.success && response.content) {
        return response.content
          .split('\n')
          .filter(line => line.trim().length > 0)
          .slice(0, count);
      }
      
      return [];
    } catch (error) {
      console.error('Title Suggestion Error:', error);
      return [];
    }
  }

  /**
   * 프롬프트 생성
   */
  private buildPrompt(request: GenerateContentRequest): string {
    const {
      title,
      description,
      category,
      keywords,
      tone = 'friendly',
      length = 'medium',
      includeImages = true
    } = request;

    const lengthMap = {
      short: '500-800자',
      medium: '800-1500자',
      long: '1500-2500자'
    };

    const toneMap = {
      formal: '정중하고 공식적인',
      casual: '친근하고 캐주얼한',
      professional: '전문적이고 신뢰할 수 있는',
      friendly: '친근하고 따뜻한',
      humorous: '유머러스하고 재치있는'
    };

    let prompt = `블로그 포스트를 작성해주세요.

제목: ${title}
${description ? `설명: ${description}` : ''}
${category ? `카테고리: ${category}` : ''}
${keywords && keywords.length > 0 ? `키워드: ${keywords.join(', ')}` : ''}

작성 가이드라인:
- 톤: ${toneMap[tone] ?? '기본'} 어조
- 길이: ${lengthMap[length]} 분량
- 구조: 서론, 본론, 결론으로 구성
- 독자 친화적이고 읽기 쉬운 내용
- SEO를 고려한 자연스러운 키워드 포함

요구사항:
1. 흥미로운 서론으로 시작
2. 본론에서 핵심 내용을 단계별로 설명
3. 실용적인 팁이나 예시 포함
4. 독자의 행동을 유도하는 결론
5. 자연스러운 문단 구분

${includeImages ? '이미지가 들어갈 위치에 [이미지 삽입] 표시를 해주세요.' : ''}

한국어로 자연스럽고 매력적인 블로그 포스트를 작성해주세요.`;

    return prompt;
  }

  /**
   * Gemini API 호출
   */
  private async callGeminiAPI(prompt: string, images?: string[]): Promise<GenerateContentResponse> {
    const url = `${this.baseUrl}/${this.config.model}:generateContent?key=${this.config.apiKey}`;
    
    const parts: any[] = [{ text: prompt }];
    
    // 이미지가 있는 경우 추가
    if (images && images.length > 0) {
      images.forEach(image => {
        parts.push({
          inline_data: {
            mime_type: 'image/jpeg',
            data: image
          }
        });
      });
    }

    const requestBody = {
      contents: [{
        parts
      }],
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxOutputTokens,
        topP: 0.8,
        topK: 40
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API 호출 실패: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('응답에서 생성된 콘텐츠를 찾을 수 없습니다.');
    }

    const content = data.candidates[0].content.parts[0].text;
    
    return {
      success: true,
      content,
      usage: data.usageMetadata ? {
        promptTokens: data.usageMetadata.promptTokenCount,
        completionTokens: data.usageMetadata.candidatesTokenCount,
        totalTokens: data.usageMetadata.totalTokenCount
      } : undefined
    };
  }

  /**
   * 텍스트를 HTML로 변환
   */
  private formatToHtml(content: string, request: GenerateContentRequest): string {
    let html = content;
    
    // 줄바꿈을 <br>로 변환
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // 단락으로 감싸기
    html = `<p>${html}</p>`;
    
    // 제목 태그 변환 (### -> h3, ## -> h2, # -> h1)
    html = html.replace(/###\s*(.+?)(<br>|<\/p>)/g, '</p><h3>$1</h3><p>');
    html = html.replace(/##\s*(.+?)(<br>|<\/p>)/g, '</p><h2>$1</h2><p>');
    html = html.replace(/#\s*(.+?)(<br>|<\/p>)/g, '</p><h1>$1</h1><p>');
    
    // 리스트 변환
    html = html.replace(/^[\-\*]\s*(.+?)(<br>|$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    
    // 강조 표시
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // 이미지 플레이스홀더 처리
    if (request.includeImages) {
      html = html.replace(/\[이미지 삽입\]/g, '<div class="image-placeholder">📷 이미지 위치</div>');
    }
    
    // 빈 태그 정리
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><br><\/p>/g, '');
    
    return html;
  }
}

// 환경변수에서 API 키 가져오기
const getGeminiApiKey = (): string => {
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드에서는 환경변수 사용 불가
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  }
  return process.env.GEMINI_API_KEY || '';
};

// 싱글톤 인스턴스 생성
let geminiService: GeminiService | null = null;

export const getGeminiService = (): GeminiService => {
  if (!geminiService) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }
    
    geminiService = new GeminiService({
      apiKey,
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxOutputTokens: 2048
    });
  }
  
  return geminiService;
};

// 편의 함수들
export const generateBlogContent = async (request: GenerateContentRequest): Promise<GenerateContentResponse> => {
  const service = getGeminiService();
  return service.generateBlogContent(request);
};

export const analyzeImage = async (imageBase64: string): Promise<GenerateContentResponse> => {
  const service = getGeminiService();
  return service.analyzeImage(imageBase64);
};

export const suggestTitles = async (description: string, count: number = 5): Promise<string[]> => {
  const service = getGeminiService();
  return service.suggestTitles(description, count);
};

export default GeminiService;