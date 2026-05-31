document.addEventListener('DOMContentLoaded', () => {
  // Global reference for carousel updating
  let setActiveCarouselCard = null;
  // ==========================================
  // 1. Navigation & Mobile Menu Interactivity
  // ==========================================
  const header = document.getElementById('main-header');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  function toggleMobileMenu() {
    mobileToggle.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  }

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close mobile menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileOverlay.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Close mobile menu when clicking outside the menu drawer
  document.addEventListener('click', (e) => {
    if (mobileOverlay.classList.contains('active') && 
        !mobileOverlay.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      toggleMobileMenu();
    }
  });

  // ==========================================
  // 2. Scroll Reveal Animations
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ==========================================
  // 3. Sonic Identity Sliders & Visual Styling
  // ==========================================
  const sliders = {
    sophistication: document.getElementById('slider-sophistication'),
    energy: document.getElementById('slider-energy'),
    warmth: document.getElementById('slider-warmth')
  };

  const displays = {
    sophistication: document.getElementById('val-sophistication'),
    energy: document.getElementById('val-energy'),
    warmth: document.getElementById('val-warmth'),
    archetype: document.getElementById('tag-archetype'),
    bpm: document.getElementById('tag-bpm')
  };

  // Initialize input slider fill styling on load
  Object.keys(sliders).forEach(key => {
    const slider = sliders[key];
    if (!slider) return;
    updateSliderBackground(slider);
    
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      if (displays[key]) {
        displays[key].textContent = `${val}%`;
      }
      updateSliderBackground(e.target);
      updateDnaTags();
      
      // Update real-time synthesizer parameters if running
      if (synthEngine.isPlaying) {
        synthEngine.updateParameters();
      }
    });
  });

  // Function to update the custom filled range slider track gradient
  function updateSliderBackground(slider) {
    if (!slider) return;
    const min = slider.min || 0;
    const max = slider.max || 100;
    const percentage = ((slider.value - min) / (max - min)) * 100;
    slider.style.setProperty('--value', `${percentage}%`);
  }

  // Update DNA cards tags based on slider scores
  function updateDnaTags() {
    if (!sliders.sophistication || !sliders.energy || !sliders.warmth) return;
    const soph = parseInt(sliders.sophistication.value);
    const nrg = parseInt(sliders.energy.value);
    const wrm = parseInt(sliders.warmth.value);

    // Dynamic BPM calculation: 80BPM baseline to 140BPM
    const calculatedBpm = Math.round(75 + (nrg / 100) * 70);
    displays.bpm.textContent = `${calculatedBpm} BPM avg`;

    // Dynamic Archetype categorization
    let archetype = "Balanced Vibe";
    if (soph > 75 && wrm > 70) {
      archetype = "Creator Archetype";
    } else if (soph > 75 && wrm <= 70) {
      archetype = "Minimalist Archetype";
    } else if (soph <= 75 && nrg > 75) {
      archetype = "Dynamic Archetype";
    } else if (soph <= 75 && nrg <= 75 && wrm > 70) {
      archetype = "Ambient Archetype";
    } else if (nrg > 80 && soph < 50) {
      archetype = "Upbeat Archetype";
    } else {
      archetype = "Structured Archetype";
    }
    displays.archetype.textContent = archetype;
  }

  // Initial tag setup
  updateDnaTags();

  // ==========================================
  // 4. Web Audio API Synthesizer Engine
  // ==========================================
  const synthEngine = {
    audioCtx: null,
    isPlaying: false,
    schedulerInterval: null,
    nextNoteTime: 0.0,
    currentBeat: 0,
    activePreset: 0,
    lastPreset: null,
    nikeAudio: null,
    nikeSource: null,
    appleAudio: null,
    appleSource: null,
    starbucksAudio: null,
    starbucksSource: null,
    swarowskiAudio: null,
    swarowskiSource: null,
    
    // Ambient sound configurations for each brand client preset
    nodes: {},
    chordIndex: 0,
    
    presets: [
      {
        // Preset 0: Nike (A Minor Pentatonic, crisp, driving beat)
        scale: [110.00, 146.83, 164.81, 220.00, 293.66, 329.63, 440.00, 587.33, 659.25],
        chords: [
          [110.00, 164.81, 220.00, 261.63], // A minor (A2, E3, A3, C4)
          [174.61, 261.63, 349.23, 440.00], // F major (F3, C4, F4, A4)
          [146.83, 220.00, 293.66, 349.23], // D minor (D3, A3, D4, F4)
          [164.81, 246.94, 329.63, 392.00]  // E minor (E3, B3, E4, G4)
        ]
      },
      {
        // Preset 1: Starbucks (C Major Pentatonic, warm, ambient pad)
        scale: [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25], 
        chords: [
          [130.81, 196.00, 261.63, 329.63], // C major (C3, G3, C4, E4)
          [174.61, 261.63, 349.23, 440.00], // F major (F3, C4, F4, A4)
          [130.81, 196.00, 261.63, 329.63], // C major (C3, G3, C4, E4)
          [146.83, 196.00, 293.66, 392.00]  // G major (G3, G3, D4, B4)
        ]
      },
      {
        // Preset 2: Apple (F Major Pentatonic, clean, minimalist synths)
        scale: [130.81, 146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 349.23, 392.00, 440.00, 523.25],
        chords: [
          [174.61, 220.00, 261.63, 329.63], // F major 9th (F3, A3, C4, E4)
          [146.83, 196.00, 261.63, 311.13], // D minor 11th (D3, G3, C4, Eb4)
          [116.54, 174.61, 233.08, 293.66], // Bb major 9th (Bb2, F3, Bb3, D4)
          [130.81, 196.00, 246.94, 349.23]  // C dominant 7th sus (C3, G3, B3, F4)
        ]
      },
      {
        // Preset 3: Swarovski (G Major Pentatonic, elegant, shimmering)
        scale: [146.83, 164.81, 196.00, 220.00, 246.94, 293.66, 329.63, 392.00, 440.00, 493.88, 587.33],
        chords: [
          [196.00, 246.94, 293.66, 392.00], // G major (G3, B3, D4, G4)
          [164.81, 220.00, 293.66, 392.00], // E minor 11th (E3, A3, D4, G4)
          [130.81, 196.00, 246.94, 329.63], // C major 7th (C3, G3, B3, E4)
          [146.83, 196.00, 220.00, 293.66]  // D sus 4 (D3, G3, A3, D4)
        ]
      }
    ],

    init() {
      // Create audio context
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn("Web Audio API not supported in this environment.");
        return;
      }
      this.audioCtx = new AudioContextClass();
      
      // Setup output chain: synth -> lowpass filter -> delay/reverb -> compressor -> destination
      this.nodes.filter = this.audioCtx.createBiquadFilter();
      this.nodes.filter.type = 'lowpass';
      
      // Delay Line for spacing
      this.nodes.delay = this.audioCtx.createDelay(1.0);
      this.nodes.delayFeedback = this.audioCtx.createGain();
      this.nodes.delayGain = this.audioCtx.createGain();
      
      this.nodes.delay.delayTime.value = 0.35;
      this.nodes.delayFeedback.gain.value = 0.4;
      this.nodes.delayGain.gain.value = 0.25;
      
      // Connect delay loop
      this.nodes.delay.connect(this.nodes.delayFeedback);
      this.nodes.delayFeedback.connect(this.nodes.delay);
      
      // Main output volume
      this.nodes.masterVolume = this.audioCtx.createGain();
      this.nodes.masterVolume.gain.value = 0.25;

      // Compressor to avoid digital clipping
      this.nodes.compressor = this.audioCtx.createDynamicsCompressor();

      // Analyser node for visualizer bars
      this.nodes.analyser = this.audioCtx.createAnalyser();
      this.nodes.analyser.fftSize = 128; // gives 64 frequency bins

      // Audio connections
      this.nodes.filter.connect(this.nodes.masterVolume);
      
      // Connect filter to delay line in parallel
      this.nodes.filter.connect(this.nodes.delay);
      this.nodes.delay.connect(this.nodes.delayGain);
      this.nodes.delayGain.connect(this.nodes.masterVolume);

      this.nodes.masterVolume.connect(this.nodes.compressor);
      this.nodes.masterVolume.connect(this.nodes.analyser); // connect to analyser
      this.nodes.compressor.connect(this.audioCtx.destination);
      
      this.updateParameters();
    },

    getValues() {
      let soph = 0.5, nrg = 0.5, wrm = 0.5;
      if (sliders.sophistication && sliders.energy && sliders.warmth) {
        soph = parseInt(sliders.sophistication.value) / 100;
        nrg = parseInt(sliders.energy.value) / 100;
        wrm = parseInt(sliders.warmth.value) / 100;
      } else if (brandPresets && brandPresets[this.activePreset]) {
        soph = brandPresets[this.activePreset].soph / 100;
        nrg = brandPresets[this.activePreset].nrg / 100;
        wrm = brandPresets[this.activePreset].wrm / 100;
      }
      return { soph, nrg, wrm };
    },

    updateParameters() {
      if (!this.audioCtx) return;
      
      const { soph, nrg, wrm } = this.getValues();
      
      // 1. Warmth maps to filter cutoff.
      const targetCutoff = 350 + (1 - wrm) * 1400;
      this.nodes.filter.frequency.setTargetAtTime(targetCutoff, this.audioCtx.currentTime, 0.1);
      this.nodes.filter.Q.setTargetAtTime(1 + (wrm * 4), this.audioCtx.currentTime, 0.1);
      
      // 2. Energy maps to delay time and feedback gain
      const targetDelayTime = 0.5 - (nrg * 0.3);
      this.nodes.delay.delayTime.setTargetAtTime(targetDelayTime, this.audioCtx.currentTime, 0.2);
      this.nodes.delayFeedback.gain.setTargetAtTime(0.2 + (nrg * 0.35), this.audioCtx.currentTime, 0.2);
    },

    playTone(frequency, time, duration, type = 'triangle', volume = 0.1) {
      if (!this.audioCtx) return;
      
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, time);
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(volume, time + 0.05); // quick attack
      gainNode.gain.setValueAtTime(volume, time + duration - 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      
      osc.connect(gainNode);
      gainNode.connect(this.nodes.filter);
      
      osc.start(time);
      osc.stop(time + duration);
    },

    scheduler() {
      const lookahead = 0.25;
      const { nrg } = this.getValues();
      const bpm = Math.round(75 + nrg * 70);
      const beatDuration = 60.0 / bpm;

      while (this.nextNoteTime < this.audioCtx.currentTime + lookahead) {
        this.scheduleBeat(this.currentBeat, this.nextNoteTime, beatDuration);
        this.nextNoteTime += beatDuration / 2; // Schedule on eighth notes
        this.currentBeat++;
      }
    },

    scheduleBeat(beat, time, beatDuration) {
      const { soph, nrg, wrm } = this.getValues();

      const activeConfig = this.presets[this.activePreset];

      // 1. Play background drone pads every 8 beats
      if (beat % 8 === 0) {
        this.chordIndex = (this.chordIndex + 1) % activeConfig.chords.length;
        const currentChord = activeConfig.chords[this.chordIndex];
        
        this.playTone(currentChord[0] / 2, time, beatDuration * 4.2, 'sine', 0.08);
        this.playTone(currentChord[1], time, beatDuration * 4.0, 'triangle', 0.04);
        this.playTone(currentChord[2], time, beatDuration * 4.0, 'triangle', 0.04);
        
        if (soph > 0.6) {
          const extensionFrequency1 = currentChord[3] * 1.5;
          const extensionFrequency2 = currentChord[0] * 3.75;
          this.playTone(extensionFrequency1, time + 0.1, beatDuration * 3.8, 'sine', 0.02);
          if (soph > 0.8) {
            this.playTone(extensionFrequency2, time + 0.2, beatDuration * 3.6, 'sine', 0.015);
          }
        }
      }

      // 2. Play high melody/arpeggio notes
      let shouldPlayMelody = false;
      const triggerThreshold = 0.35 + (1 - nrg) * 0.45;
      
      if (beat % 2 === 0) {
        shouldPlayMelody = Math.random() > triggerThreshold;
      } else {
        shouldPlayMelody = nrg > 0.6 && Math.random() > (triggerThreshold + 0.2);
      }

      if (shouldPlayMelody) {
        const baseScaleIndex = Math.floor(Math.random() * activeConfig.scale.length);
        let freq = activeConfig.scale[baseScaleIndex];
        
        if (soph > 0.7 && Math.random() > 0.6) {
          freq *= 2;
        }

        const noteDuration = beatDuration * (0.2 + (1 - nrg) * 0.8);
        const synthType = wrm > 0.6 ? 'sine' : 'triangle';
        
        this.playTone(freq, time, noteDuration, synthType, 0.04);
      }
    },

    start() {
      if (this.isPlaying) return;
      
      if (!this.audioCtx) {
        this.init();
      }
      if (!this.audioCtx) return;
      
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      
      this.isPlaying = true;
      
      if (this.activePreset === 0) {
        if (!this.nikeAudio) {
          this.nikeAudio = new Audio('Proof of Sweat.mp3');
          this.nikeAudio.loop = true;
          if (this.audioCtx.createMediaElementSource) {
            try {
              this.nikeSource = this.audioCtx.createMediaElementSource(this.nikeAudio);
              this.nikeSource.connect(this.nodes.masterVolume);
            } catch (err) {
              console.warn("Failed to route Nike audio through Web Audio API nodes:", err);
            }
          }
        }
        if (this.lastPreset !== 0) {
          this.nikeAudio.currentTime = 0;
        }
        const playPromise = this.nikeAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => console.warn("Nike audio play failed:", err));
        }
      } else if (this.activePreset === 1) {
        if (!this.starbucksAudio) {
          this.starbucksAudio = new Audio('Starbucks_tune.mp3');
          this.starbucksAudio.loop = true;
          if (this.audioCtx.createMediaElementSource) {
            try {
              this.starbucksSource = this.audioCtx.createMediaElementSource(this.starbucksAudio);
              this.starbucksSource.connect(this.nodes.masterVolume);
            } catch (err) {
              console.warn("Failed to route Starbucks audio through Web Audio API nodes:", err);
            }
          }
        }
        if (this.lastPreset !== 1) {
          this.starbucksAudio.currentTime = 0;
        }
        const playPromise = this.starbucksAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => console.warn("Starbucks audio play failed:", err));
        }
      } else if (this.activePreset === 2) {
        if (!this.appleAudio) {
          this.appleAudio = new Audio('Apple_tune.mp3');
          this.appleAudio.loop = true;
          if (this.audioCtx.createMediaElementSource) {
            try {
              this.appleSource = this.audioCtx.createMediaElementSource(this.appleAudio);
              this.appleSource.connect(this.nodes.masterVolume);
            } catch (err) {
              console.warn("Failed to route Apple audio through Web Audio API nodes:", err);
            }
          }
        }
        if (this.lastPreset !== 2) {
          this.appleAudio.currentTime = 0;
        }
        const playPromise = this.appleAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => console.warn("Apple audio play failed:", err));
        }
      } else if (this.activePreset === 3) {
        if (!this.swarowskiAudio) {
          this.swarowskiAudio = new Audio('swarowski.mp3');
          this.swarowskiAudio.loop = true;
          if (this.audioCtx.createMediaElementSource) {
            try {
              this.swarowskiSource = this.audioCtx.createMediaElementSource(this.swarowskiAudio);
              this.swarowskiSource.connect(this.nodes.masterVolume);
            } catch (err) {
              console.warn("Failed to route Swarovski audio through Web Audio API nodes:", err);
            }
          }
        }
        if (this.lastPreset !== 3) {
          this.swarowskiAudio.currentTime = 0;
        }
        const playPromise = this.swarowskiAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => console.warn("Swarovski audio play failed:", err));
        }
      } else {
        this.nextNoteTime = this.audioCtx.currentTime + 0.1;
        this.currentBeat = 0;
        this.schedulerInterval = setInterval(() => this.scheduler(), 100);
      }
      
      this.lastPreset = this.activePreset;
      this.startVisualizerLoop();
    },

    stop() {
      if (!this.isPlaying) return;
      
      this.isPlaying = false;
      clearInterval(this.schedulerInterval);
      
      if (this.nikeAudio) {
        this.nikeAudio.pause();
      }
      if (this.starbucksAudio) {
        this.starbucksAudio.pause();
      }
      if (this.appleAudio) {
        this.appleAudio.pause();
      }
      if (this.swarowskiAudio) {
        this.swarowskiAudio.pause();
      }
      
      if (this.nodes.masterVolume) {
        this.nodes.masterVolume.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.05);
      }

      this.resetVisualizerBars();
      
      setTimeout(() => {
        if (this.audioCtx && !this.isPlaying) {
          this.audioCtx.suspend();
          this.nodes.masterVolume.gain.value = 0.25;
        }
      }, 100);
    },

    visualizerAnimationFrameId: null,

    startVisualizerLoop() {
      const bgBars = document.querySelectorAll('.hero-bg-bar');
      const brandLogos = document.querySelectorAll('.brand-logo');
      
      if (!this.nodes.analyser) return;

      const bufferLength = this.nodes.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      if (bgBars.length > 0) {
        bgBars.forEach(bar => bar.style.animation = 'none');
      }

      const draw = () => {
        if (!this.isPlaying) return;

        this.visualizerAnimationFrameId = requestAnimationFrame(draw);
        this.nodes.analyser.getByteFrequencyData(dataArray);

        // Check if the analyzer is actually getting data or if we should use mock data
        let isSilent = true;
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i] > 0) {
            isSilent = false;
            break;
          }
        }

        // If it's silent and we're playing an audio preset, generate some mock frequency data for the visualizer
        if (isSilent && this.activePreset !== null && this.activePreset >= 0 && this.activePreset <= 3) {
          const time = Date.now() * 0.004;
          for (let i = 0; i < dataArray.length; i++) {
            dataArray[i] = Math.floor(
              (Math.sin(time + i * 0.25) * 0.5 + 0.5) * 150 + 
              (Math.cos(time * 0.8 + i * 0.4) * 0.3 + 0.3) * 100
            );
          }
        }

        // Dynamically visualise the active preset card's visualizer bars!
        const activeCards = document.querySelectorAll(`.mock-window-card[data-preset="${this.activePreset}"]`);
        activeCards.forEach(activeCard => {
          const visBars = activeCard.querySelectorAll('.vis-bar');
          if (visBars.length > 0) {
            const visLength = visBars.length;
            visBars.forEach(bar => {
              if (bar.style.animation !== 'none') bar.style.animation = 'none';
            });
            for (let i = 0; i < visLength; i++) {
              const binIndex = Math.min(
                Math.floor((i / visLength) * bufferLength * 0.8),
                bufferLength - 1
              );
              const rawValue = dataArray[binIndex];
              const scale = 0.12 + (rawValue / 255) * 0.88;
              visBars[i].style.transform = `scaleY(${scale})`;
            }
          }
        });

        // Update hero background wave lines
        if (bgBars.length > 0) {
          const bgLength = bgBars.length;
          for (let i = 0; i < bgLength; i++) {
            const symmetricIndex = i < bgLength / 2 ? i : bgLength - 1 - i;
            const binIndex = Math.min(
              Math.floor((symmetricIndex / (bgLength / 2)) * bufferLength * 0.6),
              bufferLength - 1
            );
            const rawValue = dataArray[binIndex];
            const scale = 0.25 + (rawValue / 255) * 0.65;
            const opacity = 0.3 + (rawValue / 255) * 0.7;

            bgBars[i].style.transform = `scaleY(${scale})`;
            bgBars[i].style.opacity = opacity;
          }
        }

        // Pulse brand logos to the music beat
        if (brandLogos.length > 0) {
          let bassSum = 0;
          const bassEnd = Math.min(8, dataArray.length);
          for (let i = 0; i < bassEnd; i++) {
            bassSum += dataArray[i];
          }
          const avgBass = bassSum / bassEnd;
          const pulseFactor = avgBass / 255;

          // Easing/smoothing using a simple linear interpolation (lerp)
          if (this.logoScale === undefined) this.logoScale = 1.0;
          const targetScale = 1.0 + pulseFactor * 0.22;
          this.logoScale += (targetScale - this.logoScale) * 0.15;

          const scaleVal = this.logoScale;
          const r = Math.round(75 + (167 - 75) * pulseFactor);
          const g = Math.round(85 + (139 - 85) * pulseFactor);
          const b = Math.round(99 + (250 - 99) * pulseFactor);
          const colorVal = `rgb(${r}, ${g}, ${b})`;
          const glowAlpha = pulseFactor * 0.75;
          const shadowVal = pulseFactor > 0.05 ? `0 0 ${8 + pulseFactor * 16}px rgba(167, 139, 250, ${glowAlpha})` : 'none';

          brandLogos.forEach(logo => {
            logo.style.transform = `scale(${scaleVal})`;
            logo.style.color = colorVal;
            logo.style.textShadow = shadowVal;
          });
        }
      };

      draw();
    },

    resetVisualizerBars() {
      if (this.visualizerAnimationFrameId) {
        cancelAnimationFrame(this.visualizerAnimationFrameId);
      }

      const bgBars = document.querySelectorAll('.hero-bg-bar');
      const visBars = document.querySelectorAll('.vis-bar');
      const brandLogos = document.querySelectorAll('.brand-logo');

      setTimeout(() => {
        bgBars.forEach(bar => {
          bar.style.transform = '';
          bar.style.opacity = '';
          bar.style.animation = '';
        });
        visBars.forEach(bar => {
          bar.style.transform = '';
          bar.style.animation = '';
        });
        brandLogos.forEach(logo => {
          logo.style.transform = '';
          logo.style.color = '';
          logo.style.textShadow = '';
        });
        this.logoScale = 1.0;
      }, 100);
    }
  };

  // Connect Synth Controls to buttons
  const btnToggleSynth = document.getElementById('btn-synth-toggle');
  const waveVisualizer = document.querySelector('.audio-wave-anim');

  if (btnToggleSynth) {
    btnToggleSynth.addEventListener('click', () => {
      if (synthEngine.isPlaying) {
        synthEngine.stop();
      } else {
        synthEngine.start();
      }
      updateBrandPlayButtonStates();
    });
  }

  // Hero Section Play Button Action (Triggers Nike playback from the carousel)
  const btnPlayDemo = document.getElementById('btn-play-demo');
  if (btnPlayDemo) {
    btnPlayDemo.addEventListener('click', () => {
      const nikePlayBtn = document.querySelector('.btn-brand-play[data-preset="0"]');
      if (nikePlayBtn) {
        nikePlayBtn.click();
      }
    });
  }

  // ==========================================
  // 5. Brand Client Showcase Player Logic
  // ==========================================
  const btnBrandPlays = document.querySelectorAll('.btn-brand-play');
  
  const brandPresets = [
    { name: "Nike", soph: 50, nrg: 90, wrm: 40 },
    { name: "Starbucks", soph: 65, nrg: 45, wrm: 85 },
    { name: "Apple", soph: 95, nrg: 35, wrm: 60 },
    { name: "Swarovski", soph: 90, nrg: 55, wrm: 70 }
  ];

  // Nike Card Track Progress Variables
  let progressInterval = null;
  let progressTime = 0; // seconds
  const trackDuration = 30; // seconds

  // Handle client-specific play button interactions
  btnBrandPlays.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const presetIdx = parseInt(btn.dataset.preset);
      
      // Update carousel active index to center this card
      const targetCard = document.querySelector(`.mock-window-card[data-preset="${presetIdx}"]`);
      const allCards = document.querySelectorAll('.brand-dna-showcase .mock-window-card');
      if (targetCard && allCards.length > 0 && typeof setActiveCarouselCard === 'function') {
        const domIdx = Array.from(allCards).indexOf(targetCard);
        if (domIdx !== -1) {
          setActiveCarouselCard(domIdx);
        }
      }
      
      if (synthEngine.isPlaying && synthEngine.activePreset === presetIdx) {
        synthEngine.stop();
      } else {
        if (synthEngine.isPlaying) {
          synthEngine.stop();
        }
        
        synthEngine.activePreset = presetIdx;
        
        // Animate the DNA sliders to match this brand's preset
        animateSlidersTo(
          brandPresets[presetIdx].soph,
          brandPresets[presetIdx].nrg,
          brandPresets[presetIdx].wrm
        );
        
        synthEngine.start();
      }
      
      updateBrandPlayButtonStates();
    });
  });

  // Sync play states across buttons and general synth buttons
  function updateBrandPlayButtonStates() {
    btnBrandPlays.forEach((btn) => {
      const presetIdx = parseInt(btn.dataset.preset);
      const isCurrentActivePlaying = synthEngine.isPlaying && presetIdx === synthEngine.activePreset;
      btn.classList.toggle('playing', isCurrentActivePlaying);
      
      const btnIcon = btn.querySelector('.icon-play-state');
      if (isCurrentActivePlaying) {
        btnIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>';
      } else {
        btnIcon.innerHTML = '<path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>';
      }
    });

    // Control Video Playback & Spotify Canvas State for all cards
    const cards = document.querySelectorAll('.mock-window-card[data-preset]');
    let activeCardIndex = -1;
    
    cards.forEach((card) => {
      const presetIdx = parseInt(card.dataset.preset);
      const isCardPlaying = synthEngine.isPlaying && synthEngine.activePreset === presetIdx;
      card.classList.toggle('canvas-active', isCardPlaying);
      if (isCardPlaying) {
        activeCardIndex = presetIdx;
      }
      
      const video = card.querySelector('.brand-cover-video');
      if (video) {
        if (isCardPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => console.warn("Video playback interrupted:", err));
          }
        } else {
          video.pause();
        }
      }
    });

    // Track Progress Bar Animation Loop
    if (activeCardIndex !== -1 && synthEngine.isPlaying) {
      const activeCards = document.querySelectorAll(`.mock-window-card[data-preset="${activeCardIndex}"]`);
      
      if (!progressInterval) {
        progressInterval = setInterval(() => {
          let activeDuration = trackDuration;
          let audioEl = null;
          
          if (activeCardIndex === 0) {
            audioEl = synthEngine.nikeAudio;
          } else if (activeCardIndex === 1) {
            audioEl = synthEngine.starbucksAudio;
          } else if (activeCardIndex === 2) {
            audioEl = synthEngine.appleAudio;
          } else if (activeCardIndex === 3) {
            audioEl = synthEngine.swarowskiAudio;
          }
          
          if (audioEl) {
            if (!isNaN(audioEl.duration) && audioEl.duration > 0) {
              activeDuration = audioEl.duration;
              progressTime = audioEl.currentTime || 0;
              
              activeCards.forEach(activeCard => {
                const totalTimeDisplay = activeCard.querySelector('.total-time');
                if (totalTimeDisplay) {
                  const totalMin = Math.floor(activeDuration / 60);
                  const totalSec = Math.floor(activeDuration % 60);
                  totalTimeDisplay.textContent = `${totalMin}:${totalSec < 10 ? '0' : ''}${totalSec}`;
                }
              });
            } else {
              progressTime += 0.25;
              if (progressTime > activeDuration) {
                progressTime = 0;
              }
              activeCards.forEach(activeCard => {
                const totalTimeDisplay = activeCard.querySelector('.total-time');
                if (totalTimeDisplay) {
                  totalTimeDisplay.textContent = '0:30';
                }
              });
            }
          } else {
            progressTime += 0.25;
            if (progressTime > trackDuration) {
              progressTime = 0;
            }
            activeCards.forEach(activeCard => {
              const totalTimeDisplay = activeCard.querySelector('.total-time');
              if (totalTimeDisplay) {
                totalTimeDisplay.textContent = '0:30';
              }
            });
          }
          
          activeCards.forEach(activeCard => {
            const progressFill = activeCard.querySelector('.progress-bar-fill');
            const currentTimeDisplay = activeCard.querySelector('.current-time');
            
            if (progressFill) {
              const pct = (progressTime / activeDuration) * 100;
              progressFill.style.width = `${pct}%`;
            }
            
            if (currentTimeDisplay) {
              const min = Math.floor(progressTime / 60);
              const sec = Math.floor(progressTime % 60);
              currentTimeDisplay.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
            }
          });
        }, 250);
      }
    } else {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      // Reset all progress bars
      const allProgressFills = document.querySelectorAll('.progress-bar-fill');
      const allCurrentTimes = document.querySelectorAll('.current-time');
      const allTotalTimes = document.querySelectorAll('.total-time');
      
      allProgressFills.forEach(el => el.style.width = '0%');
      allCurrentTimes.forEach(el => el.textContent = '0:00');
      allTotalTimes.forEach(el => el.textContent = '0:30');
      progressTime = 0;
    }

    // Also sync the DNA toggle play button state
    if (synthEngine.isPlaying) {
      if (btnToggleSynth) {
        btnToggleSynth.classList.add('playing');
        btnToggleSynth.querySelector('span').textContent = 'Stop Live Synthesized Vibe';
        btnToggleSynth.querySelector('.icon-synth-play').innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>';
      }
      if (waveVisualizer) waveVisualizer.classList.remove('hidden');
    } else {
      if (btnToggleSynth) {
        btnToggleSynth.classList.remove('playing');
        btnToggleSynth.querySelector('span').textContent = 'Play Live Synthesized Vibe';
        btnToggleSynth.querySelector('.icon-synth-play').innerHTML = '<path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>';
      }
      if (waveVisualizer) waveVisualizer.classList.add('hidden');
    }

    // Sync the Hero Play button (btnPlayDemo) with the Nike playing state (presetIdx === 0)
    const isNikePlaying = synthEngine.isPlaying && synthEngine.activePreset === 0;
    if (btnPlayDemo) {
      btnPlayDemo.classList.toggle('active', isNikePlaying);
      const demoBtnText = btnPlayDemo.querySelector('.demo-btn-text');
      const demoBtnIcon = btnPlayDemo.querySelector('.icon-play');
      if (demoBtnText) {
        demoBtnText.textContent = isNikePlaying ? 'Stop' : 'Play';
      }
      if (demoBtnIcon) {
        if (isNikePlaying) {
          demoBtnIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>';
        } else {
          demoBtnIcon.innerHTML = '<path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>';
        }
      }
    }
  }

  // Smooth interpolation animation for the DNA sliders
  let sliderAnimationId = null;
  function animateSlidersTo(targetSoph, targetNrg, targetWrm) {
    if (!sliders.sophistication || !sliders.energy || !sliders.warmth) return;
    if (sliderAnimationId) {
      cancelAnimationFrame(sliderAnimationId);
    }
    
    const duration = 600; // ms
    const startTime = performance.now();
    const startSoph = parseInt(sliders.sophistication.value);
    const startNrg = parseInt(sliders.energy.value);
    const startWrm = parseInt(sliders.warmth.value);

    function step(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress); // easeOutQuad
      
      sliders.sophistication.value = Math.round(startSoph + (targetSoph - startSoph) * ease);
      sliders.energy.value = Math.round(startNrg + (targetNrg - startNrg) * ease);
      sliders.warmth.value = Math.round(startWrm + (targetWrm - startWrm) * ease);
      
      // Update label displays
      displays.sophistication.textContent = `${sliders.sophistication.value}%`;
      displays.energy.textContent = `${sliders.energy.value}%`;
      displays.warmth.textContent = `${sliders.warmth.value}%`;
      
      // Update track fills
      updateSliderBackground(sliders.sophistication);
      updateSliderBackground(sliders.energy);
      updateSliderBackground(sliders.warmth);
      
      updateDnaTags();

      if (synthEngine.isPlaying) {
        synthEngine.updateParameters();
      }

      if (progress < 1) {
        sliderAnimationId = requestAnimationFrame(step);
      }
    }
    
    sliderAnimationId = requestAnimationFrame(step);
  }

  // ==========================================
  // 6. Responsive Coverflow Carousel Logic
  // ==========================================
  const showcaseContainer = document.querySelector('.brand-dna-showcase');
  const showcaseCards = document.querySelectorAll('.brand-dna-showcase .mock-window-card');

  if (showcaseContainer && showcaseCards.length > 0) {
    let carouselActiveIndex = 1; // Default is Nike (DOM Index 1)

    // Layout updater: assigns classes based on active index
    function updateCarouselLayout() {
      showcaseCards.forEach((card, index) => {
        card.classList.remove('pos-center', 'pos-left', 'pos-right', 'pos-hidden-left', 'pos-hidden-right');
        
        if (index === carouselActiveIndex) {
          card.classList.add('pos-center');
          card.classList.add('center-card');
          card.classList.remove('side-card');
        } else if (index === (carouselActiveIndex - 1 + 4) % 4) {
          card.classList.add('pos-left');
          card.classList.remove('center-card');
          card.classList.add('side-card');
        } else if (index === (carouselActiveIndex + 1) % 4) {
          card.classList.add('pos-right');
          card.classList.remove('center-card');
          card.classList.add('side-card');
        } else {
          card.classList.remove('center-card');
          card.classList.add('side-card');
          if (index === (carouselActiveIndex - 2 + 4) % 4) {
            card.classList.add('pos-hidden-left');
          } else {
            card.classList.add('pos-hidden-right');
          }
        }
      });
      
      // Update canvas activation classes based on which card is playing
      showcaseCards.forEach((card) => {
        const presetIdx = parseInt(card.dataset.preset);
        const isCardPlaying = synthEngine.isPlaying && synthEngine.activePreset === presetIdx;
        card.classList.toggle('canvas-active', isCardPlaying);
      });
    }

    // Set the centered card and trigger slider metric updates
    setActiveCarouselCard = function(index, playOnTransition = false) {
      if (index < 0 || index >= showcaseCards.length) return;
      
      carouselActiveIndex = index;
      updateCarouselLayout();

      const card = showcaseCards[index];
      const presetIdx = parseInt(card.dataset.preset);

      // Animate the DNA sliders to match this brand's preset
      animateSlidersTo(
        brandPresets[presetIdx].soph,
        brandPresets[presetIdx].nrg,
        brandPresets[presetIdx].wrm
      );

      // Handle track playback adjustments when active card changes
      if (synthEngine.isPlaying) {
        if (synthEngine.activePreset !== presetIdx) {
          synthEngine.stop();
          synthEngine.activePreset = presetIdx;
          setTimeout(() => {
            if (!synthEngine.isPlaying) {
              synthEngine.start();
              updateBrandPlayButtonStates();
            }
          }, 150);
        }
      } else if (playOnTransition) {
        synthEngine.activePreset = presetIdx;
        synthEngine.start();
        updateBrandPlayButtonStates();
      } else {
        // Update active preset so if they play the general Vibe synth it corresponds to the centered brand
        synthEngine.activePreset = presetIdx;
        updateBrandPlayButtonStates();
      }
    };

    // Card click events: clicking any side card centers it
    showcaseCards.forEach((card, index) => {
      card.addEventListener('click', (e) => {
        // If clicking play button, handle play state separately
        if (e.target.closest('.btn-brand-play')) return;
        setActiveCarouselCard(index);
      });
    });

    // Touch gesture swipe listeners
    let startX = 0;
    let startY = 0;
    showcaseContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    showcaseContainer.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) {
          // Swiped right -> previous card
          const prevIdx = (carouselActiveIndex - 1 + 4) % 4;
          setActiveCarouselCard(prevIdx);
        } else {
          // Swiped left -> next card
          const nextIdx = (carouselActiveIndex + 1) % 4;
          setActiveCarouselCard(nextIdx);
        }
      }
    }, { passive: true });

    // Mouse drag swipe listeners for desktop
    let isMouseDown = false;
    showcaseContainer.addEventListener('mousedown', (e) => {
      // Ignore clicks on play buttons to let them act normally
      if (e.target.closest('.btn-brand-play')) return;
      isMouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    showcaseContainer.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const endX = e.clientX;
      const endY = e.clientY;
      const diffX = endX - startX;
      const diffY = e.clientY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) {
          const prevIdx = (carouselActiveIndex - 1 + 4) % 4;
          setActiveCarouselCard(prevIdx);
        } else {
          const nextIdx = (carouselActiveIndex + 1) % 4;
          setActiveCarouselCard(nextIdx);
        }
      }
    });

    showcaseContainer.addEventListener('mouseleave', () => {
      isMouseDown = false;
    });

    // Run initially to set the layout
    updateCarouselLayout();
  }
});
