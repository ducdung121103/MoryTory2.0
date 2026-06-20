import { useNavigate } from 'react-router-dom';
import { Leaf, Sparkles, ScanLine, Camera, Sun, Heart, Star, ShoppingBag, Quote, ArrowRight, Package } from 'lucide-react';
import GoogleLoginButton from './GoogleLoginButton';

const heroImage = new URL('../assets/family-hero-Bkd13Ch-.jpg', import.meta.url).href;
const frameHandsImage = new URL('../assets/frame-hands-Av1-EfMs.jpg', import.meta.url).href;
const moment1Image = new URL('../assets/moment-1-BAEz0-VR.jpg', import.meta.url).href;
const moment2Image = new URL('../assets/moment-2-Ie1y_G2d.jpg', import.meta.url).href;
const moment3Image = new URL('../assets/moment-3-324IkTvq.jpg', import.meta.url).href;

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-line/60 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-walnut text-cream shadow-[var(--shadow-soft)]">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-serif text-2xl font-semibold tracking-tight text-walnut-deep">MoryTory</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
            <a href="#how" className="hover:text-walnut transition-colors">Cách hoạt động</a>
            <a href="#moments" className="hover:text-walnut transition-colors">Câu chuyện</a>
            <a href="#reviews" className="hover:text-walnut transition-colors">Đánh giá</a>
            <a href="#ar" className="hover:text-walnut transition-colors">Hiệu ứng AR</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/order-status')}
              className="hidden md:flex items-center gap-1.5 text-sm text-ink-muted hover:text-walnut transition-colors"
            >
              <Package className="h-4 w-4" />
              Đơn hàng
            </button>
            <GoogleLoginButton />
            <button
              onClick={() => navigate('/design')}
              className="inline-flex items-center gap-2 rounded-full bg-walnut px-4 py-2 text-sm font-medium text-cream shadow-[var(--shadow-soft)] transition hover:bg-walnut-deep"
            >
              <ShoppingBag className="h-4 w-4" />
              Thiết kế ngay
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-paper relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-walnut">
              <Sparkles className="h-3.5 w-3.5 text-sun" />
              Thủ công · Gỗ thật · Tích hợp AR
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Giữ một{" "}
              <span className="font-script font-normal text-walnut">khoảnh khắc</span>,
              <br />
              chạm vào cả <em className="text-sage-deep">ký ức</em>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              Khung ảnh gỗ MoryTory được làm thủ công từ gỗ tự nhiên, gói trọn một bức ảnh gia đình. Quét khung bằng điện thoại — kỷ niệm sống lại với tuyết rơi nhẹ, cánh hoa bay hay ánh nắng lấp lánh.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/design')}
                className="animate-breathe group inline-flex items-center gap-2 rounded-full bg-walnut px-7 py-4 text-base font-medium text-cream shadow-[var(--shadow-soft)] hover:bg-walnut-deep transition"
              >
                Bắt đầu thiết kế khung của bạn
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-walnut/30 px-6 py-4 text-base text-walnut-deep hover:bg-cream-deep transition"
              >
                <Camera className="h-4 w-4" />
                Xem cách AR hoạt động
              </a>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              <div>
                <dt className="font-serif text-3xl text-walnut-deep">1,200+</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-ink-muted">Khung đã trao</dd>
              </div>
              <div>
                <dt className="font-serif text-3xl text-walnut-deep">4.9/5</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-ink-muted">Đánh giá khách</dd>
              </div>
              <div>
                <dt className="font-serif text-3xl text-walnut-deep">100%</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-ink-muted">Gỗ tự nhiên</dd>
              </div>
            </dl>
          </div>
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-lg">
              <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-sun/40 blur-2xl" aria-hidden="true" />
              <div className="absolute -bottom-8 -right-6 h-40 w-40 rounded-full bg-sage/30 blur-3xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[2rem] border border-line bg-card p-3 shadow-[var(--shadow-warm)]">
                <img
                  src={heroImage}
                  alt="Gia đình quây quần bên khung ảnh gỗ MoryTory"
                  className="h-full w-full rounded-[1.5rem] object-cover"
                />
                <span className="absolute bottom-8 left-8 font-script text-4xl text-white drop-shadow-lg">
                  cả nhà mình
                </span>
              </div>
              <div className="tilt-card absolute -bottom-10 -left-8 hidden w-56 rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-soft)] sm:block" style={{ transform: 'rotate(-2deg)' }}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-sage/20 text-sage-deep">
                    <ScanLine className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">Quét khung</p>
                    <p className="text-xs text-ink-muted">Tuyết bắt đầu rơi…</p>
                  </div>
                </div>
              </div>
              <div className="tilt-card absolute -right-6 top-10 hidden w-44 rounded-2xl border border-line bg-card p-3 shadow-[var(--shadow-soft)] sm:block" style={{ transform: 'rotate(3deg)' }}>
                <img
                  src={frameHandsImage}
                  alt="Khung ảnh gỗ trên tay"
                  className="h-28 w-full rounded-xl object-cover"
                />
                <p className="mt-2 text-center font-script text-xl text-walnut">handmade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-line/70 bg-cream-deep/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <Leaf className="h-5 w-5 shrink-0 text-sage-deep" />
            <span>Gỗ tự nhiên, hoàn thiện thủ công</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <Sun className="h-5 w-5 shrink-0 text-sage-deep" />
            <span>Hiệu ứng AR mượt trên iOS & Android</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <Heart className="h-5 w-5 shrink-0 text-sage-deep" />
            <span>Đóng gói quà tặng miễn phí</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <Sparkles className="h-5 w-5 shrink-0 text-sage-deep" />
            <span>Bảo hành 12 tháng</span>
          </div>
        </div>
      </section>

      {/* How It Works - 5 Steps */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="font-script text-2xl text-walnut">5 bước nhẹ nhàng</span>
            <h2 className="mt-2 text-4xl font-semibold text-ink sm:text-5xl">
              Từ một tấm ảnh,
              <br />
              đến một <em className="text-sage-deep">kỷ vật</em>.
            </h2>
            <p className="mt-5 max-w-sm text-ink-muted">
              Cả quy trình chỉ mất vài phút. Bạn thiết kế, chúng tôi làm bằng tay và gửi đến tận nhà.
            </p>
          </div>
          <ol className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
            <li className="group relative rounded-3xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-3xl text-sun">01</span>
                <h3 className="font-serif text-xl text-ink">Tải ảnh kỷ niệm</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Chọn một bức ảnh gia đình bạn muốn lưu giữ.
              </p>
            </li>
            <li className="group relative rounded-3xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-3xl text-sun">02</span>
                <h3 className="font-serif text-xl text-ink">Chọn kích thước khung</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Từ khung để bàn nhỏ xinh đến khung treo tường.
              </p>
            </li>
            <li className="group relative rounded-3xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-3xl text-sun">03</span>
                <h3 className="font-serif text-xl text-ink">Chọn hiệu ứng AR</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Tuyết rơi, cánh hoa, nắng lấp lánh — tuỳ cảm xúc.
              </p>
            </li>
            <li className="group relative rounded-3xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-3xl text-sun">04</span>
                <h3 className="font-serif text-xl text-ink">Viết lời nhắn</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Một câu viết tay nhỏ — "cả nhà mình", "nhớ ông"…
              </p>
            </li>
            <li className="group relative rounded-3xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-3xl text-sun">05</span>
                <h3 className="font-serif text-xl text-ink">Nhận khung & quét</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Mở camera, quét khung, kỷ niệm sống lại.
              </p>
              <span className="absolute right-5 top-5 rounded-full bg-sage/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-sage-deep">
                AR
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* Customer Moments */}
      <section id="moments" className="relative overflow-hidden bg-cream-deep/60 py-24 sm:py-32">
        <div className="bg-grain absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-script text-2xl text-walnut">Khoảnh khắc gia đình</span>
            <h2 className="mt-2 text-4xl sm:text-5xl font-semibold text-ink">
              Mỗi khung ảnh là <em className="text-walnut">một câu chuyện</em>
            </h2>
            <p className="mt-4 text-ink-muted">
              Những kỷ niệm có thật từ các gia đình đã chọn MoryTory để giữ gìn khoảnh khắc của mình.
            </p>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <figure className="tilt-card group rounded-3xl bg-card p-3 shadow-[var(--shadow-soft)]" style={{ transform: 'rotate(-1deg)' }}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={moment1Image}
                  alt="Tiếng cười của con"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="pointer-events-none absolute bottom-4 left-5 right-5 font-script text-3xl text-white drop-shadow-md">
                  Tiếng cười của con
                </span>
              </div>
              <figcaption className="px-3 py-5">
                <p className="text-ink leading-relaxed">
                  "Mỗi lần quét khung là một lần được nghe lại tiếng cười của con bé hôm đi dã ngoại. Cảm giác như khoảnh khắc ấy chưa từng đi qua."
                </p>
                <p className="mt-3 text-sm text-ink-muted">— Chị Mai, Hà Nội</p>
              </figcaption>
            </figure>
            <figure className="tilt-card group rounded-3xl bg-card p-3 shadow-[var(--shadow-soft)]" style={{ transform: 'rotate(1deg)' }}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={moment2Image}
                  alt="Ông và cháu"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="pointer-events-none absolute bottom-4 left-5 right-5 font-script text-3xl text-white drop-shadow-md">
                  Ông và cháu
                </span>
              </div>
              <figcaption className="px-3 py-5">
                <p className="text-ink leading-relaxed">
                  "Tặng ông món quà sinh nhật là khung ảnh hai ông cháu. Ông ngồi quét đi quét lại cả buổi chiều, mắt cứ rưng rưng."
                </p>
                <p className="mt-3 text-sm text-ink-muted">— Anh Khoa, Đà Nẵng</p>
              </figcaption>
            </figure>
            <figure className="tilt-card group rounded-3xl bg-card p-3 shadow-[var(--shadow-soft)]" style={{ transform: 'rotate(-1deg)' }}>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={moment3Image}
                  alt="Bữa cơm cuối tuần"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="pointer-events-none absolute bottom-4 left-5 right-5 font-script text-3xl text-white drop-shadow-md">
                  Bữa cơm cuối tuần
                </span>
              </div>
              <figcaption className="px-3 py-5">
                <p className="text-ink leading-relaxed">
                  "Treo khung ảnh bữa cơm gia đình ngay phòng bếp. Mỗi sáng đi ngang, cả nhà đều mỉm cười — đó là điều quý nhất."
                </p>
                <p className="mt-3 text-sm text-ink-muted">— Gia đình Hạnh – Tuấn</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-end gap-10 sm:grid-cols-2">
          <div>
            <span className="font-script text-2xl text-walnut">Khách thật, chuyện thật</span>
            <h2 className="mt-2 text-4xl font-semibold text-ink sm:text-5xl">
              1.200+ gia đình đã <em className="text-sage-deep">tin chọn</em> MoryTory
            </h2>
          </div>
          <div className="flex items-center gap-6 text-ink-muted sm:justify-end">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-sun text-sun" />
              ))}
              <span className="ml-2 font-serif text-2xl text-walnut-deep">4.9</span>
            </div>
            <span className="text-sm">trên 412 đánh giá Google & Shopee</span>
          </div>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="tilt-card group relative overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]" style={{ transform: 'rotate(-0.6deg)' }}>
            <Quote className="absolute right-5 top-5 h-7 w-7 text-sun/60" />
            <div className="flex items-center gap-3">
              <img src={moment1Image} alt="Chị Mai" className="h-14 w-14 rounded-full object-cover ring-2 ring-cream-deep" />
              <div>
                <p className="font-serif text-lg text-ink">Chị Mai</p>
                <p className="text-xs text-ink-muted">Hà Nội</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-sun text-sun" />
              ))}
              <span className="ml-1 rounded-full bg-sage/15 px-2 py-0.5 text-[11px] font-medium text-sage-deep">Quà tặng mẹ</span>
            </div>
            <p className="mt-4 leading-relaxed text-ink">
              "Mẹ mình bật khóc khi quét khung và thấy cảnh sinh nhật mẹ chuyển động. Đáng từng đồng."
            </p>
          </article>
          <article className="tilt-card group relative overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]" style={{ transform: 'rotate(0deg)' }}>
            <Quote className="absolute right-5 top-5 h-7 w-7 text-sun/60" />
            <div className="flex items-center gap-3">
              <img src={moment2Image} alt="Anh Khoa" className="h-14 w-14 rounded-full object-cover ring-2 ring-cream-deep" />
              <div>
                <p className="font-serif text-lg text-ink">Anh Khoa</p>
                <p className="text-xs text-ink-muted">Đà Nẵng</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-sun text-sun" />
              ))}
              <span className="ml-1 rounded-full bg-sage/15 px-2 py-0.5 text-[11px] font-medium text-sage-deep">Kỷ niệm ông cháu</span>
            </div>
            <p className="mt-4 leading-relaxed text-ink">
              "Khung gỗ chắc, mùi gỗ thật rất dễ chịu. Hiệu ứng AR mượt trên cả iPhone của ông."
            </p>
          </article>
          <article className="tilt-card group relative overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-[var(--shadow-soft)]" style={{ transform: 'rotate(0.6deg)' }}>
            <Quote className="absolute right-5 top-5 h-7 w-7 text-sun/60" />
            <div className="flex items-center gap-3">
              <img src={moment3Image} alt="Gia đình Hạnh – Tuấn" className="h-14 w-14 rounded-full object-cover ring-2 ring-cream-deep" />
              <div>
                <p className="font-serif text-lg text-ink">Gia đình Hạnh – Tuấn</p>
                <p className="text-xs text-ink-muted">TP.HCM</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-sun text-sun" />
              ))}
              <span className="ml-1 rounded-full bg-sage/15 px-2 py-0.5 text-[11px] font-medium text-sage-deep">Ảnh cưới</span>
            </div>
            <p className="mt-4 leading-relaxed text-ink">
              "Treo trong phòng khách, ai đến chơi cũng tò mò quét thử. MoryTory đóng gói rất tinh tế."
            </p>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section id="ar" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-walnut px-8 py-16 text-cream shadow-[var(--shadow-warm)] sm:px-16 sm:py-20">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sun/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-terracotta/30 blur-3xl" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <span className="font-script text-3xl text-sun">cho người bạn yêu thương</span>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">
              Bắt đầu giữ một khoảnh khắc — ngay hôm nay.
            </h2>
            <p className="mt-5 text-cream/80">
              Mỗi khung MoryTory đều được làm riêng theo kỷ niệm của bạn. Không có hai khung nào giống nhau.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/design')}
                className="group inline-flex items-center gap-2 rounded-full bg-sun px-7 py-4 font-medium text-ink transition hover:brightness-110"
              >
                Thiết kế khung của tôi
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#moments"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-6 py-4 text-cream hover:bg-cream/10 transition"
              >
                Đọc thêm câu chuyện
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-cream-deep/40">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-walnut-deep">
            <Leaf className="h-4 w-4" />
            <span className="font-serif text-lg">MoryTory</span>
            <span className="text-ink-muted">— giữ kỷ niệm, một cách dịu dàng.</span>
          </div>
          <p className="text-sm text-ink-muted">© 2026 MoryTory. Thủ công tại Việt Nam.</p>
        </div>
      </footer>
    </div>
  );
}