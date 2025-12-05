### 【下記コード2】 `logic.js` に貼り付ける内容

これは、**状態管理**と**全てのアプリケーションロジック**（画面切り替え、認証処理など）を抽出したものです。

```javascript
// 状態管理
let currentPage = 'home';
// ステップは5つ: 1:電話, 2:プロフィール, 3:メール, 4:年齢確認, 5:パスワード
let registrationStep = 1;
let isAccountActive = false; // 審査が通ってログイン可能かどうか

// ユーザーデータとログイン情報のモック
let userData = {
    userId: 'KISMET_10001', // 審査完了後に通知されるID
    phoneNumber: '09012345678',
    authCode: '123456',
    name: 'アカリ',
    gender: '女性',
    age: 26,
    comment: 'こんにちは！素敵な出会いを探しています。', 
    email: 'kismet@example.com', 
    isAgeVerified: false, // 年齢確認書類提出済み
    password: '123456', // モックのパスワード
    tempLoginId: '', // ログイン画面で一時的に保持するID
    tempLoginPw: '' // ログイン画面で一時的に保持するPW
};

const appElement = document.getElementById('app');

// -----------------------
// ロジック関数
// -----------------------

// トップ画面から「KISMETを始める」を押したときのステータスチェック
window.checkRegistrationStatus = function() {
    if (isAccountActive) {
        // 既にログイン済み（アカウント有効）
        navigate('mainApp');
    } else if (userData.isAgeVerified) {
        // 書類提出済みだが、まだアクティブでない（審査中）
        navigate('reviewPending');
    } else {
        // 新規登録開始
        // ステップインジケーターに合わせて、ステップ数を1に戻す
        registrationStep = 1;
        navigate('register');
    }
}

// パスワード入力処理（フォーカス移動と結合）
window.handlePasswordInput = function(input, index) {
    // 数字以外を削除
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
    // 次のフィールドにフォーカスを移動
    if (input.value.length === 1 && index < 5) {
        const nextInput = document.getElementById(`pw-digit-${index + 1}`);
        if (nextInput) nextInput.focus();
    }

    // 全て入力されたかチェック
    checkPasswordCompletion();
}

// パスワード入力完了チェック
function checkPasswordCompletion() {
    let password = '';
    for (let i = 0; i < 6; i++) {
        const input = document.getElementById(`pw-digit-${i}`);
        // input が null の場合があるためチェック
        if (!input || input.value.length !== 1) { 
            const btn = document.getElementById('pw-submit-btn');
            if (btn) {
                btn.disabled = true;
                btn.classList.remove('kismet-primary-bg', 'hover:opacity-90');
                btn.classList.add('bg-gray-400', 'cursor-not-allowed');
            }
            return false;
        }
        password += input.value;
    }
    // userData.password = password; // モックのため固定値のままにしておく
    const btn = document.getElementById('pw-submit-btn');
    if (btn) {
        btn.disabled = false;
        btn.classList.remove('bg-gray-400', 'cursor-not-allowed');
        btn.classList.add('kismet-primary-bg', 'hover:opacity-90');
    }
    return true;
}


// 画面切り替えとアニメーション
function navigate(page) {
    const currentElement = appElement;
    currentElement.classList.add('hide');
    
    setTimeout(() => {
        currentPage = page;
        if (page === 'register') {
            // 登録フロー開始時にステップをリセット
            if (registrationStep > 1) { 
                registrationStep = 1;
            }
        }
        
        render();
        currentElement.classList.remove('hide');
    }, 300);
}

// ステップ遷移
window.nextStep = function() {
    if (registrationStep < 5) { // ステップは1から5まで
        registrationStep++;
        render();
    }
}

// ステップ1: 認証コード送信
window.sendAuthCode = function() {
    if (userData.phoneNumber.length < 10) {
        alertMessage('有効な電話番号を入力してください。');
        return;
    }
    
    document.getElementById('phone-input-section').classList.add('hidden');
    document.getElementById('code-input-section').classList.remove('hidden');
}

// ステップ1: コード検証
window.verifyCode = function() {
    if (userData.authCode === '123456') { // モック用の固定コード
        nextStep(); // ステップ2へ。ここで registrationStep が 2 になり、render() が呼ばれる。
    } else {
        alertMessage('認証コードが正しくありません。');
    }
}

// ステップ3: メールアドレス検証
window.validateEmailAndNext = function() {
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value.trim();

    if (!emailValue.includes('@') || !emailValue.includes('.')) {
        alertMessage('有効なメールアドレスを入力してください。');
        return;
    }
    userData.email = emailValue;
    nextStep(); // ステップ4へ
}

// ステップ5: パスワード設定完了 (登録完了)
window.completeRegistration = function() {
    if (checkPasswordCompletion()) {
        // パスワード設定完了
        const currentPassword = Array.from({ length: 6 }).map((_, i) => document.getElementById(`pw-digit-${i}`).value).join('');
        userData.password = currentPassword; // 設定されたパスワードを保持

        userData.isAgeVerified = true; // 年齢確認書類提出済みフラグを立てる
        
        alertMessage(`ご登録ありがとうございます。書類確認のため、審査待機画面に戻ります。審査結果はメールにてお知らせします。`);
        navigate('reviewPending'); // 審査待機中のホーム画面へ
    }
}

// ログイン処理
window.handleLogin = function() {
    const id = userData.tempLoginId || document.getElementById('login-id')?.value;
    const pw = userData.tempLoginPw || document.getElementById('login-pw')?.value;
    
    // ログイン成功の条件: IDが一致 AND パスワードが一致 AND アカウントが有効化されている
    if (id === userData.userId && pw === userData.password && userData.isAgeVerified) {
        isAccountActive = true;
        userData.tempLoginId = ''; 
        userData.tempLoginPw = '';
        alertMessage('ログインに成功しました。KISMETへようこそ！');
        navigate('mainApp'); // 本サービス利用可能状態の画面へ
    } else if (id === userData.userId && userData.isAgeVerified === true && pw !== userData.password) {
        alertMessage('パスワードが正しくありません。');
    }
    else {
        alertMessage('ユーザーIDまたはパスワードが正しくありません。アカウントがまだ有効でない可能性もあります。審査完了メールをご確認ください。');
    }
}

// ログアウト処理
window.logout = function() {
    isAccountActive = false;
    alertMessage('ログアウトしました。');
    navigate('home');
}


// カスタムアラート（alert()の代替）
window.alertMessage = function(message) {
    const modalElement = document.getElementById('custom-modal');
    const modalContent = document.getElementById('modal-content');

    modalContent.innerHTML = `
        <p class="text-lg font-medium text-gray-800 mb-4">${message}</p>
        <button id="modal-ok-btn" 
                class="px-4 py-2 kismet-primary-bg text-white rounded-lg hover:opacity-90 transition duration-150">
            OK
        </button>
    `;
    modalElement.classList.remove('hidden');
    modalElement.classList.add('flex', 'opacity-100');
    modalContent.classList.remove('scale-90', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
    
    document.getElementById('modal-ok-btn').onclick = () => {
        modalElement.classList.remove('flex', 'opacity-100');
        modalElement.classList.add('hidden', 'opacity-0');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-90', 'opacity-0');
    };
}

// 描画関数
function render() {
    let content = '';
    switch (currentPage) {
        case 'home':
            content = homeTemplate(userData);
            break;
        case 'mainApp':
            content = mainAppTemplate(userData);
            break;
        case 'reviewPending':
            content = reviewPendingTemplate;
            break;
        case 'register':
            content = registerTemplate(registrationStep);
            // registration-contentの中にステップごとの内容を挿入
            setTimeout(() => {
                const regContent = document.getElementById('registration-content');
                if (!regContent) return;
                
                let stepContent = '';
                if (registrationStep === 1) {
                    stepContent = step1Template(userData);
                } else if (registrationStep === 2) {
                    stepContent = step2Template(userData);
                } else if (registrationStep === 3) {
                    stepContent = step3Template(userData);
                } else if (registrationStep === 4) {
                    stepContent = step4Template;
                } else if (registrationStep === 5) {
                    stepContent = step5Template;
                    // パスワード入力フィールドを再描画後にリセット
                    setTimeout(() => {
                        for (let i = 0; i < 6; i++) {
                            const input = document.getElementById(`pw-digit-${i}`);
                            if (input) input.value = '';
                        }
                        checkPasswordCompletion(); // 初期状態でボタンを無効化
                    }, 100);
                }
                regContent.innerHTML = stepContent;
                // 描画後の値の反映（ロジックの複雑化を避けるため、既存のロジックを維持）
                if (registrationStep === 1) {
                    if (document.getElementById('phone-number')) document.getElementById('phone-number').value = userData.phoneNumber;
                    if (document.getElementById('code-input-section') && !document.getElementById('code-input-section').classList.contains('hidden')) {
                        document.getElementById('auth-code').value = userData.authCode;
                    }
                } else if (registrationStep === 2) {
                    if (document.getElementById('name')) document.getElementById('name').value = userData.name;
                    if (document.getElementById('age')) document.getElementById('age').value = userData.age;
                    if (document.getElementById('gender')) document.getElementById('gender').value = userData.gender;
                    if (document.getElementById('comment')) document.getElementById('comment').value = userData.comment;
                } else if (registrationStep === 3) {
                    if (document.getElementById('email')) document.getElementById('email').value = userData.email;
                }
            }, 50);
            break;
        case 'login':
            content = loginTemplate(userData);
            // ログインフォームの値を反映
            setTimeout(() => {
                if (document.getElementById('login-id')) document.getElementById('login-id').value = userData.tempLoginId;
                if (document.getElementById('login-pw')) document.getElementById('login-pw').value = userData.tempLoginPw;
            }, 50);
            break;
        default:
            content = homeTemplate(userData);
    }

    appElement.innerHTML = content;
}

// 初期ロード時に描画を開始
window.onload = () => {
    render();
};
