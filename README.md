## <sub><img src="koshian_autolink_futaba/icons/icon-48.png"></sub> KOSHIAN 自動リンク生成 改
このFirefoxアドオンはふたば☆ちゃんねるでURLや塩のファイル名からリンクを作成する[Pachira](https://addons.mozilla.org/ja/firefox/user/anonymous-a0bba9187b568f98732d22d51c5955a6/)氏の[KOSHIAN 自動リンク生成](https://addons.mozilla.org/ja/firefox/addon/koshian-autolink-futaba/)の非公式改変版です。  
「YouTubeのプレビュー横幅」などのオプションをオリジナル版に追加しています。  

※このアドオンはWebExtensionアドオン対応のFirefox専用となります。  
※他のKOSHIAN改変版などのふたば閲覧支援ツールは[こちら](https://github.com/akoya-tomo/futaba_auto_reloader_K/wiki/)。

## 機能
* オリジナルの機能（KOSHIAN 自動リンク生成）
  - ふたば☆ちゃんねるのスレッド画面でURLや塩のファイル名からリンクを作成します。
* 追加された機能（KOSHIAN 自動リンク生成 改）
  - [![\(New\)](images/new.png "New")]() 「YouTubeのプレビュー横幅」オプション（デフォルト：0 = デフォルトの横幅）  
    YouTubeのプレビューサイズはデフォルトだと最大でも300px × 150pxです。  
    このオプションを設定すると、指定した横幅でYouTubeのプレビューを表示することができます。  
    （プレビュー最大幅の設定より優先されます）  
  - 「引用された塩のファイル名のリンクを作成する」オプション（デフォルト：無効）  
    無効にすると引用された塩のファイル名はリンク作成しません。  
    これはリンク作成すると[KOSHIAN 引用をポップアップで表示](https://addons.mozilla.org/ja/firefox/addon/koshian-popup-quote/)（[改](https://github.com/akoya-tomo/koshian_autolink_futaba_kai/)）が引用元ポップアップできなくなるためです。  
    有効にするとオリジナル版と同様に引用された塩のファイル名もリンク作成します。  
  - 「画像プレビュー上にリンクを作成する」オプション（デフォルト：無効）  
    有効にすると画像プレビュー上にリンクが作成されて、プレビューをクリックで画像が開けるようになります。  

## インストール
**GitHub**  
[![インストールボタン](images/install_button.png "クリックでアドオンをインストール")](https://github.com/akoya-tomo/koshian_autolink_futaba_kai/releases/download/v1.2.1/koshian_autolink_futaba_kai-1.2.1-an+fx.xpi)  

※「接続エラーのため、アドオンをダウンロードできませんでした。」と表示されてインストール出来ない時はインストールボタンを右クリックしてxpiファイルをダウンロードし、メニューのツール→アドオン（またはCtrl+Shift+A）で表示されたアドオンマネージャーのページにxpiファイルをドラッグ＆ドロップして下さい。  

## 注意事項
* 本アドオンを有効にしたときはオリジナル版を無効にするか削除して下さい。  
* オリジナル版とは別アドオンなので設定は初期値に戻ります。  
  再度設定をお願い致します。  
* フレーム表示では動作しません。

## 更新履歴
* v1.2.1 2018-08-25
  - v1.2.0でm.youtube.comがプレビューできない不具合を修正  
* v1.2.0 2018-08-11
  - YouTubeのプレビュー横幅の設定を追加  
  - gaming.youtube.comのプレビューを表示するように修正  
* v1.1.3 2018-06-01
  - アドオンを実行するサイトに[ふたポ](http://futapo.futakuro.com/)の過去ログ\(kako.futakuro.com\)を追加  
* v1.1.2 2018-05-08
  - あぷ・あぷ小のリンク修正
* v1.1.1 2018-04-28
  - 塩の大瓶・中瓶のDLKey付対策でリンクの拡張子を削除
* v1.1.0 2018-02-22
  - 「画像プレビュー上にリンクを作成する」オプションを追加
* v1.0.2 2018-02-06
  - アドオンの自動更新を有効化
* v1.0.1 2017-12-18
  - typo修正
* v1.0.0 2017-12-18
  - KOSHIAN 自動リンク生成 v1.4.3ベース
  - 「引用された塩のファイル名のリンクを作成する」オプションを追加
