// auto-blog-service/src/components/types/form.ts
// 폼 관련 타입 정의: 폼 컴포넌트에서 사용되는 인터페이스 및 타입을 정의합니다.

// 폼 관련 타입 정의
export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  validation?: ValidationRule[];
  options?: SelectOption[];
  disabled?: boolean;
  defaultValue?: any;
  description?: string;
}

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'multiselect'
  | 'checkbox' 
  | 'radio' 
  | 'date' 
  | 'datetime' 
  | 'file' 
  | 'image'
  | 'toggle'
  | 'range';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface ValidationRule {
  type: ValidationType;
  value?: any;
  message: string;
}

export type ValidationType = 
  | 'required' 
  | 'minLength' 
  | 'maxLength' 
  | 'min' 
  | 'max' 
  | 'pattern' 
  | 'email' 
  | 'url' 
  | 'custom';

export interface FormError {
  field: string;
  message: string;
  type?: string;
}

export interface FormState<T = any> {
  data: T;
  errors: FormError[];
  isLoading: boolean;
  isValid: boolean;
  isDirty: boolean;
  touched: string[];
}

export interface FormConfig {
  fields: FormField[];
  submitText?: string;
  resetText?: string;
  validation?: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    showErrorsOnSubmit?: boolean;
  };
  layout?: 'vertical' | 'horizontal' | 'inline';
}

export interface FileUploadConfig {
  maxSize: number; // bytes
  allowedTypes: string[];
  multiple?: boolean;
  compress?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface DatePickerConfig {
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
  locale?: string;
  placeholder?: string;
}

export interface TextareaConfig {
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export interface PostGenerationForm {
  topic: string;
  keywords: string[];
  targetLength: number;
  tone: 'formal' | 'casual' | 'professional' | 'friendly';
  includeImages: boolean;
  seoOptimized: boolean;
  category?: string;
  tags: string[];
  scheduledAt?: Date;
  template?: string;
  customPrompt?: string;
}

export interface ProjectSettingsForm {
  name: string;
  description?: string;
  blogPlatform: 'naver' | 'tistory' | 'wordpress' | 'custom';
  autoPublish: boolean;
  publishSchedule: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    days?: number[];
  };
  categories: string[];
  defaultTags: string[];
  seoOptimization: boolean;
  imageOptimization: boolean;
}