import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // 設定保存処理
  const saveSettings = () => {
    // 実際のアプリではAPIリクエストを行う
    console.log("設定を保存:", {
      name,
      email,
      notificationEnabled,
    });

    // 成功メッセージを表示
    setSuccessMessage("設定が保存されました");

    // 3秒後にメッセージを消す
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">設定</h1>

      {successMessage && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              プロフィール
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              アカウント情報の確認と更新
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
              <div className="col-span-1 sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  名前
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-slate-100 p-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-1 sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  メールアドレス
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-slate-100 p-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              アプリ設定
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              アプリケーションの動作設定
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <button
                    onClick={() => setNotificationEnabled(!notificationEnabled)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
                        notificationEnabled ? 'bg-[#2B3467]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                        notificationEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="notifications"
                    className="font-medium text-gray-700"
                  >
                    通知を有効にする
                  </label>
                  <p className="text-gray-500">
                    アプリからの通知を受け取るかどうかを設定します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={saveSettings}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
