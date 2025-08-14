import { NextRequest, NextResponse } from 'next/server'

// Cloud server URL - update this when deploying
const CLOUD_SERVER_URL = process.env.CLOUD_SERVER_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postData, naverAccount } = body

    console.log('클라우드 서버로 블로그 포스팅 요청:', { 
      postData, 
      naverAccount: { id: naverAccount?.id, hasPassword: !!naverAccount?.password } 
    })

    // Validate required data
    if (!postData?.title || !postData?.content) {
      return NextResponse.json({ 
        success: false, 
        message: '제목과 내용은 필수입니다.',
        error: 'Missing required fields'
      }, { status: 400 })
    }

    if (!naverAccount?.id) {
      return NextResponse.json({ 
        success: false, 
        message: '네이버 계정 ID가 필요합니다.',
        error: 'Missing Naver account ID'
      }, { status: 400 })
    }

    // Prepare request data for cloud server
    const cloudServerPayload = {
      postData: {
        title: postData.title,
        content: postData.content,
        category: postData.category || null,
        tags: postData.tags || null
      },
      naverAccount: {
        id: naverAccount.id
        // No password needed for manual login
      }
    }

    // Submit task to cloud server
    console.log('클라우드 서버에 작업 제출 중...')
    const taskResponse = await fetch(`${CLOUD_SERVER_URL}/api/blog/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cloudServerPayload)
    })

    if (!taskResponse.ok) {
      const errorData = await taskResponse.text()
      console.error('클라우드 서버 작업 제출 실패:', errorData)
      return NextResponse.json({ 
        success: false, 
        message: '클라우드 서버에서 작업을 시작할 수 없습니다.',
        error: errorData
      }, { status: 500 })
    }

    const taskData = await taskResponse.json()
    const taskId = taskData.task_id

    console.log('작업이 시작되었습니다:', taskId)

    // 즉시 task_id 반환하여 프론트엔드에서 폴링하도록 변경
    return NextResponse.json({ 
      success: true,
      task_id: taskId,
      message: taskData.message || '작업이 시작되었습니다.',
      status: taskData.status || 'pending'
    })

  } catch (error) {
    console.error('API 엔드포인트 에러:', error)
    return NextResponse.json({ 
      success: false, 
      message: '서버 에러가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 에러'
    }, { status: 500 })
  }
}