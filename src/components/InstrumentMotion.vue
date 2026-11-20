<template>
  <div class="instrument-motion" :class="{ paused }" aria-hidden="true">
    <div class="motion-label"><span></span>{{ labels[mode] }}<small>动态演示</small></div>
    <svg viewBox="0 0 300 120" fill="none">
      <path class="scope-grid" d="M0 20H300M0 40H300M0 60H300M0 80H300M0 100H300M30 0V120M60 0V120M90 0V120M120 0V120M150 0V120M180 0V120M210 0V120M240 0V120M270 0V120" />
      <template v-if="mode === 0">
        <g class="wave-trace">
          <path v-for="offset in [0, 300]" :key="offset" :transform="`translate(${offset},0)`" d="M0 60C12 60 13 22 25 22S38 98 50 98S63 22 75 22S88 98 100 98S113 22 125 22S138 98 150 98S163 22 175 22S188 98 200 98S213 22 225 22S238 98 250 98S263 22 275 22S288 60 300 60" />
        </g>
        <path class="secondary-trace" d="M0 80H35V40H75V80H115V40H155V80H195V40H235V80H275V40H300" />
        <path class="sweep" d="M0 0V120" />
      </template>
      <template v-else-if="mode === 1">
        <rect class="measured-part" x="95" y="24" width="110" height="72" rx="18" />
        <circle class="measured-part" cx="150" cy="60" r="22" />
        <path class="dimension" d="M95 13H205M95 8V18M205 8V18M218 24V96M213 24H223M213 96H223" />
        <g class="target"><circle r="11" /><path d="M-18 0H18M0-18V18" /></g>
        <path class="sweep" d="M0 0V120" />
      </template>
      <template v-else>
        <g class="optical-sample"><path d="M60 25H240V95H60ZM80 40H220V80H80ZM100 50H200V70H100Z" /><path d="M120 25V95M180 25V95" /></g>
        <path class="optical-scan" d="M45 0H255" />
        <path class="dimension" d="M45 30V12H65M235 12H255V30M45 90V108H65M235 108H255V90M140 60H160M150 50V70" />
      </template>
    </svg>
    <div class="motion-scale"><span>{{ captions[mode] }}</span><span>TEST / 0{{ mode + 1 }}</span></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ mode: number; paused: boolean }>();
const labels = ['信号采集', '精密定位', '光学扫描'];
const captions = ['WAVEFORM', 'ALIGNMENT', 'OPTICAL SCAN'];
</script>

<style scoped lang="scss">
.instrument-motion {
  position: absolute;
  z-index: 3;
  right: -1%;
  bottom: 13%;
  width: clamp(200px, 18vw, 290px);
  padding: 14px 16px 10px;
  border: 1px solid #83b73566;
  border-radius: 12px;
  background: #ffffffed;
  box-shadow: 0 16px 40px #416d261a;
  pointer-events: none;
  color: #507d22;
  svg { display: block; width: 100%; margin: 12px 0 8px; overflow: hidden; }
}
.motion-label { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; }
.motion-label > span { width: 5px; height: 5px; background: #83b735; border-radius: 50%; }
.motion-label small { margin-left: auto; font-size: 10px; font-weight: 400; color: #65715e; }
.motion-scale { display: flex; justify-content: space-between; font-size: 9px; letter-spacing: 0.08em; }
.scope-grid { stroke: #83b73524; stroke-width: 0.7; }
.wave-trace { stroke: #649e29; stroke-width: 2; animation: signal-flow 5s linear infinite; }
.secondary-trace { stroke: #99bd58; opacity: 0.65; stroke-width: 1; }
.sweep { stroke: #507d22; stroke-width: 1; stroke-dasharray: 4 3; animation: signal-sweep 4s linear infinite; }
.measured-part, .optical-sample { stroke: #83b735; stroke-width: 1.5; }
.dimension { stroke: #507d22; stroke-width: 1; }
.target { stroke: #41661b; stroke-width: 1; animation: target-position 6s ease-in-out infinite; }
.optical-scan { stroke: #649e29; stroke-width: 3; filter: drop-shadow(0 -4px 4px #83b735); animation: optical-sweep 4s ease-in-out infinite alternate; }
.paused * { animation-play-state: paused; }
@keyframes signal-flow { to { transform: translateX(-300px); } }
@keyframes signal-sweep { from { transform: translateX(0); } to { transform: translateX(300px); } }
@keyframes target-position { 0%, 100% { transform: translate(95px, 24px); } 30% { transform: translate(205px, 96px); } 60%, 80% { transform: translate(150px, 60px); } }
@keyframes optical-sweep { from { transform: translateY(20px); } to { transform: translateY(100px); } }
@media (max-width: 768px) {
  .instrument-motion { width: 150px; padding: 8px; bottom: 16%; right: -4px; }
  .motion-label { font-size: 11px; gap: 4px; }
  .motion-label small { font-size: 9px; }
  .instrument-motion svg { margin: 6px 0; }
  .motion-scale { font-size: 7px; }
}
@media (prefers-reduced-motion: reduce) {
  .instrument-motion * { animation: none; }
  .target { transform: translate(150px, 60px); }
  .sweep { transform: translateX(150px); }
  .optical-scan { transform: translateY(60px); }
}
</style>
