(module
  (memory (export "memory") 1)

  (global $b (mut i32) (i32.const 0))

  ;;now that I have varint.decode, and compare
  ;;is already implemented in skiplist.wasm,
  ;;I have enough to implement my binary format.

  (func $decode (export "decode")
    (param $ptr i32)
    (param $bytes i32)
    (result f64)
    (local $w i64) ;;working
    (local $c i64) ;;current
;;    (local $s i64) ;;shift
    (local $b i32) ;;bytes

;;    (set_local $s (i64.const 0))
    (set_global $b (i32.const 0))
    ;; 1
    ;; read one byte

    (loop $forever
      (set_local $c (i64.load8_u (get_local $ptr)))
      ;; shift into working var
      (set_local $w
        (i64.or
          (get_local $w)
          (i64.shl
            (i64.and (get_local $c) (i64.const 0x7f) )
            (i64.extend_u/i32 (i32.mul (get_local $b) (i32.const 7)))
          )
        )
      )

      (set_local $b (i32.add (get_local $b) (i32.const 1)) )

      (if
        (i64.eqz (i64.and (get_local $c) (i64.const 0x80) ))
        (then
          (i32.store8 (get_local $bytes) (get_local $b))
          (return (f64.convert_u/i64 (get_local $w)))
        )
      )

  ;;    (set_local $s (i64.add (get_local $s) (i64.const 7)) )
      (set_local $ptr (i32.add (get_local $ptr) (i32.const 1)) )

      (br $forever)
    )
    (unreachable)
  )


  (func $sum (export "sum")
    (param $ptr i32)
    (param $bytes i32)
    (result f64)
    (local $w f64)
    (local $c f64)
    (loop $while
      (set_local $c (call $decode (get_local $ptr) (get_local $bytes) ))
      (set_local $w (f64.add (get_local $w) (get_local $c)))
      (if (i32.eqz (i32.trunc_u/f64 (get_local $c)))
        (return (get_local $w))
      )
      (set_local $ptr
        (i32.add (get_local $ptr) (i32.load8_u (get_local $bytes) ) )
      )
      (br $while)
    )
    (unreachable)
  )

  (func $noop (export "noop")
    (param $arg i32)
    (result i32)
    (get_local $arg)
  )

  (func $bytes (export "bytes")
    (result i32)
    (get_global $b)
  )
)


