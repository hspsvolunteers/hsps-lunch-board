export const API_URL =
  'https://script.google.com/macros/s/AKfycbyGifTJg7edkKslUSuAdv3QwTa2oUotu56pQjbEdFKPMnK1Hka54NncorYrm8_I--fhQA/exec';

/**
 * 送出 POST 請求的共用函式
 * ⚠️ 關鍵：使用 'text/plain;charset=utf-8' 避免 CORS OPTIONS preflight，
 * 並使用 redirect: 'follow' 處理 Google Apps Script 內部的 302 重新導向。
 */
export const sendToGas = async (payload) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      redirect: 'follow',
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API 請求失敗:', error);
    return { success: false, message: '網路連線錯誤，請稍後再試。' };
  }
};

/**
 * 1. 取得公開佈告欄案件 (GET 請求)
 */
export async function fetchPublicIssues() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      redirect: 'follow',
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || '讀取資料失敗');
    }
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error('取得公開案件失敗:', error);
    throw error;
  }
}

/**
 * 2. 家長問題填寫送出 (POST 請求)
 * payload: { action: 'create', data: { incidentDate, dishName, ... } }
 */
export async function submitIssue(data) {
  const result = await sendToGas({ action: 'create', data });
  if (!result.success) {
    throw new Error(result.message || '送出失敗');
  }
  return result;
}

/**
 * 3. 委員取得完整列表包含個資 (POST 請求)
 * payload: { action: 'getAdminData', password: '...' }
 */
export async function fetchAdminIssues(password) {
  const result = await sendToGas({ action: 'getAdminData', password });
  if (!result.success) {
    const err = new Error(result.message || '密碼錯誤或無法讀取');
    err.response = result;
    throw err;
  }
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * 4. 委員更新案件 (POST 請求)
 * payload: { action: 'update', password: '...', data: { trackingId, status, reply, isPublic } }
 */
export async function updateIssue(password, updateData) {
  const result = await sendToGas({ action: 'update', password, data: updateData });
  if (!result.success) {
    const err = new Error(result.message || '更新失敗');
    err.response = result;
    throw err;
  }
  return result;
}

/** 處理試算表欄位布林值 (true / 'TRUE') */
export const toBool = (v) => v === true || String(v).toUpperCase() === 'TRUE';

export const STATUS_OPTIONS = ['待處理', '處理中', '已回覆'];