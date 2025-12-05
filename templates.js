// -----------------------
// 画面定義 (HTMLテンプレート)
// -----------------------

// ヘッダーテンプレート (ロゴとキャッチフレーズ)
const getHeader = (title = null) => `
    <div class="text-center pt-8 pb-4">
        <div class="kismet-primary-red text-2xl font-bold tracking-wider mb-1">
            <span class="mr-1">&hearts;</span> KISMET
        </div>
        ${title ? `<h2 class="text-2xl font-bold mt-4">${title}</h2>` : 
            `<p class="text-sm text-gray-500">運命を、期限付きで。</p>`}
    </div>
`;
// 登録ステップインジケーター (5ステップ)
const getStepIndicator = (currentStep) => {
    const steps = [
        { id: 1, label: '電話番号' },
        { id: 2, label: 'プロフィール' },
        { id: 3, label: 'メールアドレス' }, 
        { id: 4, label: '年齢確認' },
        { id: 5, label: 'パスワード設定' } 
    ];
    return `
        <div class="flex justify-between items-start text-center px-4 py-4 mb-4 relative">
            ${steps.map((step, index) => {
                let circleClass = 'bg-gray-300';
                let labelClass = 'text-gray-500';

                if (step.id === currentStep) {
                    circleClass = 'kismet-primary-bg shadow-lg shadow-pink-300/50';
                    labelClass = 'kismet-primary-red font-semibold';
                } else if (step.id < currentStep) {
                    circleClass = 'kismet-complete-green shadow-lg shadow-green-300/50'; 
                    labelClass = 'kismet-complete-text font-semibold';
                }
                
                return `
                    <div class="flex flex-col items-center z-10 mx-1 flex-1">
                        <div class="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs transition-colors duration-300 ${circleClass} flex-shrink-0 mb-1">
                            ${step.id}
                        </div>
                        <div class="text-[0.6rem] leading-tight transition-colors duration-300 ${labelClass} w-full px-0 overflow-hidden text-clip whitespace-nowrap">
                            ${step.label}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// --- 1. トップ画面 (HOME) ---
const homeTemplate = (userData) => `
    ${getHeader()}
    <div class="p-8 pt-0">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            本当にメッセージが続く<br>マッチングだけを。
        </h1>
        <p class="text-sm text-gray-600 mb-8">
            いいねが成立したら、女性からのアクション期限は**たった24時間**。ダラダラとした関係はもう終わり。運命の出会いを逃さない仕組みです。
        </p>

        <div class="space-y-4 mb-10">
            <div class="p-4 rounded-xl kismet-soft-pink border-2 border-pink-100 flex items-start">
                <div class="text-xl kismet-primary-red mr-3 mt-1">&#128337;</div>
                <div>
                    <h3 class="font-bold text-gray-900">【24時間の期限】</h3>
                    <p class="text-xs text-gray-600">マッチングリストが溜まる心配なし。本当に興味のある相手とだけ、集中してコミュニケーションが始まります。</p>
                </div>
            </div>
            <div class="p-4 rounded-xl kismet-soft-blue border-2 border-blue-100 flex items-start">
                <div class="text-xl text-blue-600 mr-3 mt-1">⚡️</div>
                <div>
                    <h3 class="font-bold text-gray-900">【女性がファーストステップ】</h3>
                    <p class="text-xs text-gray-600">女性からのメッセージでチャットがオープン。男性は待つだけ、女性は「いいね」と思った相手にだけ迷わずアプローチできます。</p>
                </div>
            </div>
            <div class="p-4 rounded-xl kismet-soft-green border-2 border-green-100 flex items-start">
                <div class="text-xl text-green-600 mr-3 mt-1">&#10003;</div>
                <div>
                    <h3 class="font-bold text-gray-900">【真剣な出会いの場】</h3>
                    <p class="text-xs text-gray-600">期限とルールの存在が、お互いに「今すぐ動く」モチベーションとなり、真剣な関係構築を後押しします。</p>
                </div>
            </div>
        </div>
        
        <button onclick="checkRegistrationStatus()" class="w-full py-3 kismet-primary-bg text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition duration-150">
            KISMETを始める（無料登録へ）
        </button>
        
        <div class="text-center mt-4">
            <button onclick="navigate('login')" class="text-sm text-gray-600 hover:text-gray-900 transition duration-150">
                すでにアカウントをお持ちの方はこちら (ログイン画面へ)
            </button>
        </div>

        <div class="text-center text-xs text-gray-400 mt-8">
            &copy; 2025 KISMET Fate Matching Service.
        </div>
    </div>
`;
// ログイン成功後の本アプリ画面 
const mainAppTemplate = (userData) => `
    ${getHeader('KISMETへようこそ！')}
    <div class="p-8 pt-0">
        <div class="p-6 rounded-xl bg-green-50 border border-green-300 text-green-800 mb-6">
            <p class="font-bold text-lg">✅ 認証済みアカウント</p>
            <p class="text-sm mt-2">全ての機能をご利用いただけます。早速、運命の相手を探しに行きましょう！</p>
            <p class="text-xs mt-3 text-gray-500">ユーザーID: ${userData.userId}</p>
        </div>
        
        <button onclick="alertMessage('スワイプ画面へ遷移します！')" class="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition duration-150">
            KISMETを始める
        </button>

        <button onclick="logout()" class="w-full py-2 text-sm text-red-500 hover:text-red-700 transition duration-150 mt-4">
            ログアウト
        </button>

        <div class="text-center text-xs text-gray-400 mt-8">
            &copy; 2025 KISMET Fate Matching Service.
        </div>
    </div>
`;
// 審査待機中の画面 
const reviewPendingTemplate = `
    ${getHeader('アカウント審査中')}
    <div class="p-8 pt-0">
        <div class="p-6 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-800 mb-6">
            <p class="font-bold text-lg">⏳ 年齢確認審査中です</p>
            <p class="text-sm mt-2">ご提出ありがとうございます。審査結果は**メール**で通知します。通知が届くまで、しばらくお待ちください。</p>
            <p class="text-xs mt-3 text-gray-500">※審査完了後、改めてメールからログインをお願いします。</p>
        </div>

        <button disabled class="w-full py-3 bg-gray-400 text-white font-bold rounded-xl shadow-lg cursor-not-allowed">
            審査完了までお待ちください
        </button>
        
        <button onclick="navigate('home')" class="mt-6 w-full py-2 text-sm text-gray-500 hover:text-pink-600 transition duration-150">
            トップに戻る
        </button>

        <div class="text-center text-xs text-gray-400 mt-8">
            &copy; 2025 KISMET Fate Matching Service.
        </div>
    </div>
`;
// --- 2. 登録画面 (REGISTER) ---
const registerTemplate = (registrationStep) => `
    ${getHeader('新規アカウント作成')}
    <div class="p-8 pt-0">
        ${getStepIndicator(registrationStep)}
        
        <div id="registration-content">
            </div>
        
        <button onclick="navigate('home')" class="mt-6 w-full py-2 text-sm text-gray-500 hover:text-pink-600 transition duration-150">
            トップに戻る
        </button>
    </div>
`;
// ステップ1: 電話番号認証
const step1Template = (userData) => `
    <h3 class="text-xl font-bold text-gray-900 mb-4">ステップ1: 電話番号の確認</h3>
    <p class="text-sm text-gray-600 mb-6">不正利用防止のため、SMSによる本人確認を行います。（この成功でアカウントが確定します）</p>

    <div id="phone-input-section">
        <input type="tel" id="phone-number" placeholder="09012345678" value="${userData.phoneNumber}"
               class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-pink-500 transition duration-150 shadow-inner mb-6"
               oninput="userData.phoneNumber = this.value.replace(/[^0-9]/g, '');">
        
        <button onclick="sendAuthCode()" id="send-code-btn" 
                class="w-full py-4 kismet-primary-bg text-white font-bold rounded-xl shadow-md hover:opacity-90 transition duration-150">
            認証コードを送信
        </button>
    </div>
    
    <div id="code-input-section" class="hidden">
        <p class="text-sm text-green-600 mb-4">
            ${userData.phoneNumber}に認証コードを送信しました。
        </p>
        <input type="number" id="auth-code" placeholder="123456" value="${userData.authCode}"
               class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-pink-500 transition duration-150 shadow-inner mb-6"
               oninput="userData.authCode = this.value.replace(/[^0-9]/g, '');">
        
        <button onclick="verifyCode()" id="verify-code-btn" 
                class="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition duration-150">
            コードを検証して次へ
        </button>
    </div>
`;
// ステップ2: プロフィール登録
const step2Template = (userData) => `
    <h3 class="text-xl font-bold text-gray-900 mb-4">ステップ2: プロフィール登録</h3>
    <p class="text-sm text-gray-600 mb-6">スワイプするための基本情報を入力してください。</p>
    
    <div class="space-y-4">
        <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">名前</label>
            <input type="text" id="name" placeholder="アカリ" value="${userData.name}"
                   class="w-full p-3 border border-gray-300 rounded-lg focus:border-pink-500 shadow-sm"
                   oninput="userData.name = this.value">
        </div>
        <div class="flex space-x-4">
            <div class="flex-1">
                <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">性別</label>
                <select id="gender" class="w-full p-3 border border-gray-300 rounded-lg focus:border-pink-500 shadow-sm bg-white"
                        onchange="userData.gender = this.value">
                    <option value="女性" ${userData.gender === '女性' ? 'selected' : ''}>女性 (Female)</option>
                    <option value="男性" ${userData.gender === '男性' ? 'selected' : ''}>男性 (Male)</option>
                </select>
            </div>
            <div class="flex-1">
                <label for="age" class="block text-sm font-medium text-gray-700 mb-1">年齢</label>
                <input type="number" id="age" placeholder="26" value="${userData.age}"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:border-pink-500 shadow-sm"
                       oninput="userData.age = this.value">
            </div>
        </div>

        <div>
            <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">自己紹介コメント (任意)</label>
            <textarea id="comment" placeholder="KISMETで素敵な出会いを探しています！"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:border-pink-500 shadow-sm h-24 resize-none"
                      oninput="userData.comment = this.value">${userData.comment}</textarea>
        </div>

        <div class="pt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">プロフィール写真のアップロード</label>
            <div class="w-full border-2 border-dashed border-gray-300 p-8 rounded-xl text-center text-gray-500">
                <div class="text-3xl mb-2">⬆️</div>
                <p class="text-sm">写真を追加（必須）</p>
            </div>
        </div>

        <button onclick="nextStep()" id="profile-submit-btn" 
                class="w-full py-4 kismet-primary-bg text-white font-bold rounded-xl shadow-md hover:opacity-90 transition duration-150 mt-6">
            プロフィールを登録して次へ
        </button>
    </div>
`;
// ステップ3: メールアドレス入力
const step3Template = (userData) => `
    <h3 class="text-xl font-bold text-gray-900 mb-4">ステップ3: メールアドレスの登録</h3>
    <p class="text-sm text-gray-600 mb-6">
        審査結果、重要なお知らせ、およびパスワード再設定の通知は、このメールアドレスに届きます。
    </p>

    <div class="space-y-6">
        <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input type="email" id="email" placeholder="kismet@example.com" value="${userData.email}"
                   class="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-pink-500 transition duration-150 shadow-inner"
                   oninput="userData.email = this.value">
        </div>
        
        <p class="text-xs text-gray-500">
            @docomo.ne.jpや@softbank.ne.jpなどのキャリアメールは、迷惑メール設定により届かない場合があります。
        </p>

        <button onclick="validateEmailAndNext()" 
                class="w-full py-4 kismet-primary-bg text-white font-bold rounded-xl shadow-md hover:opacity-90 transition duration-150 mt-4">
            メールアドレスを登録して次へ
        </button>
    </div>
`;
// ステップ4: 年齢確認
const step4Template = `
    <h3 class="text-xl font-bold kismet-primary-red mb-4">⚠️ サービス利用前の重要ステップ</h3>
    <h4 class="text-xl font-bold text-gray-900 mb-6">公的書類による年齢確認</h4>

    <div class="p-4 rounded-lg bg-red-50 border border-red-300 mb-6">
        <p class="text-sm font-semibold text-red-600 mb-2">【法律で必須】</p>
        <p class="text-xs text-red-700">日本の法律に基づき、**18歳未満の方の利用を防ぐ**ため、全てのユーザーに年齢確認書類の提出を義務付けています。</p>
    </div>

    <h4 class="font-bold text-gray-900 mb-3">提出できる書類の例:</h4>
    <ul class="list-disc list-inside space-y-1 text-sm text-gray-600 mb-8 ml-4">
        <li>運転免許証</li>
        <li>健康保険証</li>
        <li>パスポート</li>
        <li>マイナンバーカード</li>
    </ul>
    
    <p class="text-xs text-gray-500 mb-8">
        書類提出後、運営による確認が完了するまでサービスは利用できません。
    </p>

    <button onclick="nextStep()" 
            class="w-full py-4 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition duration-150">
        書類を提出する（モック：次のステップへ）
    </button>
`;
// ステップ5: パスワード設定
const step5Template = `
    <h3 class="text-xl font-bold text-gray-900 mb-4">ステップ5: パスワード設定</h3>
    <p class="text-sm text-gray-600 mb-6">
        ログイン時に使用する**6桁のパスワード（半角数字のみ）**を設定してください。
    </p>

    <div class="space-y-6">
        <div class="flex justify-center password-input-group space-x-2">
            ${Array.from({ length: 6 }).map((_, i) => `
                <input type="tel" maxlength="1" id="pw-digit-${i}" 
                       class="border-2 border-gray-300 rounded-lg focus:border-pink-500 shadow-inner"
                       oninput="handlePasswordInput(this, ${i})"
                       pattern="[0-9]" inputmode="numeric">
            `).join('')}
        </div>
        
        <p id="password-error" class="text-sm text-red-500 text-center hidden">
            パスワードは6桁の数字である必要があります。
        </p>

        <button onclick="completeRegistration()" id="pw-submit-btn" disabled 
                class="w-full py-4 bg-gray-400 text-white font-bold rounded-xl shadow-md transition duration-150 mt-4">
            このパスワードで登録を完了する
        </button>
    </div>
`;
// --- 3. ログイン画面 (LOGIN) ---
const loginTemplate = (userData) => `
    ${getHeader('アカウントにログイン')}
    <div class="p-8 pt-0">
        <h3 class="text-xl font-bold text-gray-900 mb-4">ユーザーIDとパスワードでログイン</h3>
        <p class="text-sm text-gray-600 mb-6">
            審査完了メールに記載のユーザーIDと、登録時に設定した6桁のパスワードを入力してください。（モックではID: ${userData.userId}、PW: ${userData.password}）
        </p>

        <div class="space-y-4">
            <div>
                <label for="login-id" class="block text-sm font-medium text-gray-700 mb-1">ユーザーID</label>
                <input type="text" id="login-id" placeholder="KISMET_10001" value="${userData.tempLoginId}"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:border-pink-500 shadow-sm"
                       oninput="userData.tempLoginId = this.value">
            </div>
            <div>
                <label for="login-pw" class="block text-sm font-medium text-gray-700 mb-1">パスワード（6桁）</label>
                <input type="password" id="login-pw" placeholder="••••••" value="${userData.tempLoginPw}" maxlength="6"
                       class="w-full p-3 border border-gray-300 rounded-lg focus:border-pink-500 shadow-sm"
                       oninput="userData.tempLoginPw = this.value">
            </div>
        </div>

        <button onclick="handleLogin()" 
                class="w-full py-4 kismet-primary-bg text-white font-bold rounded-xl shadow-md hover:opacity-90 transition duration-150 mt-8">
            ログイン
        </button>
        
        <div class="text-center mt-6">
            <button onclick="navigate('home')" class="text-sm text-gray-500 hover:text-pink-600 transition duration-150">
                トップに戻る
            </button>
        </div>
    </div>
`;

