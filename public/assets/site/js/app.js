function ssCart(e, t) {
    return null === ssCartVariable && (ssCartVariable = new ssCartClass), void 0 !== t && void 0 !== t.csrf_token && (ssCartVariable.csrf_token = t.csrf_token), void 0 !== t && void 0 !== t.data && (ssCartVariable.data = JSON.parse(t.data)), void 0 !== t && void 0 !== t.sent && (ssCartVariable.sent = t.sent), void 0 !== t && void 0 !== t.min_amount && (ssCartVariable.min_amount = t.min_amount), void 0 !== t && void 0 !== t.bonuses && (ssCartVariable.bonuses = t.bonuses), void 0 !== t && void 0 !== t.min_bonuses_debiting && (ssCartVariable.min_bonuses_debiting = t.min_bonuses_debiting), void 0 !== t && void 0 !== t.debit && (ssCartVariable.debit = t.debit), void 0 !== t && void 0 !== t.not_use_deal && (ssCartVariable.not_use_deal = t.not_use_deal), ssCartVariable.event = e, ssCartVariable
}

function ssCartClass() {
    this.event, this.csrf_token, this.id = 0, this.ratio = 1, this.name = ".ss-cart", this.badge = ".badge", this.cart = "/ajax/cart/", this.data = [], this.min_amount = 0, this.bonuses = 0, this.min_bonuses_debiting = 0, this.rate = .1, this.debit = !1, this.not_use_deal = !1, this.sent = [], this.promocodes = [], this.discounts = [], this.interval = void 0, this.push = !1, this.bus, this.load = function() {
        var e = u.name.replace(/^[\.\#]{1}/, ""),
            t = ["mini-list", "mini-static", "mini-fixed", "step1-total", "step1-bonuses", "step1-list", "step2-tab1-continue", "step2-tab2-continue", "mobile-mini-static1", "mobile-mini-static2"];
        $.get(u.cart, {}, function(n) {
            var i = $(n);
            for (var o in t) $("#" + e + "-load-" + t[o]).length > 0 && $("#" + e + "-load-" + t[o]).replaceWith(i.find("#" + e + "-load-" + t[o]).html());
            u.init(), $("body").trigger("ss.loaded.cart", [u])
        }, "html")
    }, this.init = function() {
        u.bus = new Vue;
        var e = u.name.replace(/^[\.\#]{1}/, ""),
            i = ["mini-list", "step1-list"],
            o = ["mini-static", "mini-fixed", "step1-total", "step1-bonuses", "step2-tab1-continue", "step2-tab2-continue", "mobile-mini-static1", "mobile-mini-static2"];
        setInterval(function() {
            !1 !== u.push && (u.push = !1, $("body").trigger("ss.push.before.cart", [u]), $.post(u.cart, {
                _token: u.csrf_token,
                data: function() {
                    var e = [],
                        t = [],
                        n = [];
                    for (var i in u.data) e.push(function(e) {
                        var t = {};
                        for (var n in u.sent) t[u.sent[n]] = e[u.sent[n]];
                        return t
                    }(u.data[i]));
                    for (var i in u.promocodes) t.push(u.promocodes[i]);
                    for (var o in u.discounts)
                        for (var i in u.data) u.data[i].id == u.discounts[o].id && n.push(u.discounts[o]);
                    if (e.length > 0) return {
                        not_use_deal: u.not_use_deal,
                        debit: u.debit,
                        dataset: e,
                        promocodes: t,
                        discounts: n
                    }
                }()
            }, function(e) {
                $("body").trigger("ss.push.after.cart", [u, e])
            }, "json"))
        }, 100);
        for (var d in o) $("#" + e + "-el-" + o[d]).length > 0 && (Vue.component(e + "-component-" + o[d], {
            props: ["amount", "total", "total_format", "min_amount", "min_amount_format", "not_use_deal", "used_deal", "discount"],
            mounted: function() {
                var e = this,
                    t = function() {
                        var e = 0;
                        !0 === u.debit && (e += parseInt(u.rate * n(u.totalSum(), u.totalAmount())));
                        for (var t in u.data)
                            for (var i in u.discounts) u.discounts[i].id == u.data[t].id && (e += u.discounts[i].value * u.data[t].amount);
                        return e
                    };
                e.amount = e.count(), e.total = e.sum(), e.total_format = e.format(e.sum()), e.not_use_deal = u.not_use_deal, e.used_deal = l(), e.min_amount_format = e.format(u.min_amount), e.min_amount = u.min_amount, e.discount = t(), u.bus.$on("cart-change", function() {
                    e.amount = e.count(), e.total = e.sum(), e.total_format = e.format(e.sum()), e.not_use_deal = u.not_use_deal, e.used_deal = l(), e.min_amount_format = e.format(u.min_amount), e.min_amount = u.min_amount, e.discount = t()
                })
            },
            template: "#" + e + "-template-" + o[d],
            methods: {
                count: function() {
                    return u.totalAmount()
                },
                bonuses: function() {
                    return r()
                },
                hasBonuses: function() {
                    return this.bonuses() > u.min_bonuses_debiting
                },
                changeDebit: function() {
                    s()
                },
                changeUseDeal: function() {
                    a()
                },
                decline: function(e, t) {
                    return c(e, t)
                },
                sum: function() {
                    return u.totalSum(!0)
                },
                format: function(e) {
                    switch (/\./.test(parseFloat(e))) {
                        case !1:
                            return t(e, 0, ".", " ");
                        default:
                            return t(e, 2, ".", " ")
                    }
                }
            }
        }), new Vue({
            el: "#" + e + "-el-" + o[d]
        }));
        for (var d in i) $("#" + e + "-el-" + i[d]).length > 0 && new Vue({
            el: "#" + e + "-el-" + i[d],
            data: {
                items: u.data,
                min_amount: u.min_amount,
                debit: u.debit,
                not_use_deal: u.not_use_deal,
                used_deal: l()
            },
            updated: function() {
                this.used_deal = l();
                var t = new RegExp("^" + e + "-el-(.*)$"),
                    n = $(this.$el).attr("id").match(t)[1];
                $("body").trigger("ss.vue." + n + ".updated.cart", [u])
            },
            methods: {
                destroy: function(e) {
                    ssCart().setID(e).destroy()
                },
                clean: function() {
                    ssCart().clean()
                },
                change: function(e, t, n) {
                    ssCart(e).setID(t).change(n).save("replace")
                },
                decline: function(e, t) {
                    return c(e, t)
                },
                has: function() {
                    return this.items.length > 0
                },
                sum: function(e, n) {
                    var i = e * n;
                    switch (/\./.test(parseFloat(i))) {
                        case !1:
                            return t(i, 0, ".", " ");
                        default:
                            return t(i, 2, ".", " ")
                    }
                },
                total: function() {
                    return this.sum(u.totalSum(!0), 1)
                },
                bonuses: function() {
                    return r()
                },
                hasBonuses: function() {
                    return this.bonuses() > u.min_bonuses_debiting
                },
                changeDebit: function() {
                    s()
                },
                changeUseDeal: function() {
                    a(), this.not_use_deal = u.not_use_deal, this.used_deal = l()
                },
                amount: function() {
                    return u.totalAmount()
                },
                disabled: function() {
                    return u.totalSum() < u.min_amount
                },
                hasPromocodeDiscount: function(e) {
                    for (var t in u.data)
                        if (u.data[t].id == e)
                            for (var n in u.discounts)
                                if (u.discounts[n].id == e) return !0;
                    return !1
                },
                price: function(e, t) {
                    var n = 0;
                    for (var i in u.data) u.data[i].id == e && (n += u.data[i].price * u.data[i].amount);
                    for (var i in u.data)
                        if (u.data[i].id == e)
                            for (var o in u.discounts) u.discounts[o].id == e && (n += u.discounts[o].value * u.data[i].amount);
                    return this.sum(n, 1)
                }
            }
        })
    }, this.change = function(e) {
        var t = {
            abort: !1
        };
        if ($("body").trigger("ss.change.cart", [u, e, t]), !1 === t.abort) {
            var n = o(),
                i = $(u.event.target).parents(u.name + "-" + u.id).eq(0);
            0 != e && (n += e), n <= 0 && (n = u.ratio), isNaN(n) && (n = u.ratio), i.find("input").val(n), $("body").trigger("ss.changed.cart", [u, e])
        }
        return u
    }, this.destroy = function() {
        u.setPush(!1);
        for (var e in u.data) u.data[e].id == u.id && u.data.splice(e, 1);
        i(0), u.bus.$emit("cart-change"), $("body").trigger("ss.destroy.cart", [u]), u.setPush(!0)
    }, this.clean = function() {
        u.setPush(!1);
        for (var e in u.data) u.setID(u.data[e].id), i(0);
        u.data.splice(0, u.data.length), u.bus.$emit("cart-change"), $("body").trigger("ss.clean.cart", [u]), u.setPush(!0)
    }, this.save = function(t, n) {
        if (u.setPush(!1), e()) e().amount = "merge" === t ? parseInt(e().amount) + o() : o(), i(e().amount);
        else {
            var r, s = {
                    id: u.id,
                    amount: o()
                },
                a = $(u.name + "-" + u.id)[0].attributes,
                l = u.name.replace(/^[\.\#]{1}/, ""),
                c = new RegExp("^data-" + l + "-(.*)$");
            for (var d in a)
                if ("object" == typeof a[d] && c.test(a[d].name)) switch (r = a[d].name.match(c)[1], $(u.name + "-" + u.id).attr("data-" + l + "-" + r)) {
                    case "1":
                    case "true":
                    case !0:
                        s[r] = !0;
                        break;
                    case "0":
                    case "false":
                    case !1:
                        s[r] = !1;
                        break;
                    default:
                        s[r] = $(u.name + "-" + u.id).attr("data-" + l + "-" + r)
                }
                u.data.push(s), u.correctPrice(s.id, function() {
                for (var e in u.discounts)
                    if (u.discounts[e].id == s.id) return parseInt("-" + parseInt(u.discounts[e].value));
                return 0
            }()), i(s.amount)
        }
        void 0 !== n && n(u), u.bus.$emit("cart-change"), $("body").trigger("ss.save.cart", [u]), u.setPush(!0)
    }, this.setRatio = function(e) {
        return u.ratio = parseInt(e), u
    }, this.setID = function(e) {
        return u.id = parseInt(e), u
    }, this.totalSum = function(e) {
        var t = 0;
        for (var i in u.data) t += u.data[i].price * u.data[i].amount;
        return !0 === e && !0 === u.debit && (t -= parseInt(u.rate * n(t, u.totalAmount()))), t
    }, this.totalAmount = function() {
        var e = 0;
        for (var t in u.data) e += parseInt(u.data[t].amount);
        return e
    }, this.setPush = function(e) {
        !1 === e ? void 0 !== u.interval && (clearInterval(u.interval), u.interval = void 0) : void 0 === u.interval && ($("body").trigger("ss.push.active.cart", [u]), u.interval = setInterval(function() {
            u.push = !0, u.setPush(!1)
        }, 500))
    }, this.correctPrice = function(e, n) {
        var i = function() {
            for (var t in u.data)
                if (u.data[t].id == e) return u.data[t];
            return !1
        }();
        if (!1 !== i) {
            var o = Math.floor(parseFloat(i.price) + n);
            i.price = /\./.test(parseFloat(o)) ? t(o, 2, ".", "") : t(o, 0, ".", ""), i.price_format = /\./.test(parseFloat(o)) ? t(o, 2, ".", " ") : t(o, 0, ".", " ")
        }
    }, this.reLoad = function() {
        d(u.data), u.bus.$emit("cart-change")
    };
    var e = function() {
            for (var e in u.data)
                if (parseInt(u.data[e].id) === u.id) return u.data[e];
            return !1
        },
        t = function(e, t, n, i) {
            var o, r, s, a, l;
            return isNaN(t = Math.abs(t)) && (t = 2), void 0 === n && (n = ","), void 0 === i && (i = "."), o = parseInt(e = (+e || 0).toFixed(t)) + "", r = o.length > 3 ? o.length % 3 : 0, l = r ? o.substr(0, r) + i : "", s = o.substr(r).replace(/(\d{3})(?=\d)/g, "$1" + i), a = t ? n + Math.abs(e - o).toFixed(t).replace(/-/, 0).slice(2) : "", l + s + a
        },
        n = function(e, t) {
            if (0 == u.bonuses) return u.bonuses;
            var n = function() {
                var e = Math.floor(u.rate * u.bonuses);
                return Math.floor(e / u.rate)
            }();
            return e = parseInt(e), t = parseInt(t), e - t <= Math.floor(u.rate * n) ? Math.floor((e - t) / u.rate) : n
        },
        i = function(e) {
            var t = $(u.name + "-" + u.id + " " + u.badge);
            0 != t.length && (0 == e && !1 === t[0].hasAttribute("hidden") && t.attr("hidden", !0), e > 0 && !0 === t[0].hasAttribute("hidden") && t.removeAttr("hidden"), t.text(e))
        },
        o = function() {
            var e = u.ratio,
                t = $(u.event.target).parents(u.name + "-" + u.id).eq(0);
            return t.find("input").length > 0 && (e = parseInt(t.find("input").val()), (isNaN(e) || e < 0) && (e = u.ratio)), e
        },
        r = function() {
            return n(u.totalSum(), u.totalAmount())
        },
        s = function() {
            u.debit = !u.debit;
            var e = {
                id: "bonuses",
                amount: 1
            };
            u.data.push(e);
            for (var t in u.data) "bonuses" == u.data[t].id && u.data.splice(t, 1);
            u.bus.$emit("cart-change"), $("body").trigger("ss.save.cart", [u]), u.setPush(!0)
        },
        a = function() {
            u.not_use_deal = !u.not_use_deal, u.bus.$emit("cart-change"), $("body").trigger("ss.save.cart", [u]), u.setPush(!0)
        },
        l = function() {
            return !! function() {
                for (var e in ssDeals().getDeals())
                    if (1 == ssDeals().getDeals()[e].isActive()) return !1;
                return !0
            }() || u.not_use_deal
        },
        c = function(e, t) {
            e = Math.abs(e);
            var n = [2, 0, 1, 1, 1, 2];
            return t[e % 100 > 4 && e % 100 < 20 ? 2 : n[e % 10 < 5 ? e % 10 : 5]]
        },
        d = function(e) {
            var t = [];
            for (var n in e) void 0 !== e[n] && t.push(e[n]);
            e.splice(0, e.length);
            for (var n in t) e.push(t[n])
        },
        u = this
}

function ssCartAddit(e) {
    return null === ssCartAdditVariable && (ssCartAdditVariable = new ssCartAdditClass, void 0 !== e && void 0 !== e.data && (ssCartAdditVariable.data = JSON.parse(e.data)), ssCartAdditVariable.load()), ssCartAdditVariable
}

function ssCartAdditClass() {
    this.data;
    var e;
    this.load = function() {
        var e = ["tablewares", "sauces", "promo"];
        $.get("/ajax/addits/", {}, function(n) {
            var i = $(n);
            for (var o in e) $("#ss-cartaddit-load-" + e[o]).length > 0 && $("#ss-cartaddit-load-" + e[o]).replaceWith(i.find("#ss-cartaddit-load-" + e[o]).html());
            t(), $("body").trigger("ss.loaded.cartaddit", [s])
        }, "html")
    }, this.add = function(e) {}, this.remove = function(e) {};
    var t = function() {
            e = ssCart(ssCartVariable.event);
            var t = ["tablewares", "sauces", "promo"];
            e.addits = function() {
                var e = {};
                for (var t in s.data) {
                    void 0 === e[t] && (e[t] = []);
                    for (var i in s.data[t]) e[t].push(s.data[t][i].id);
                    ! function() {
                        var e;
                        for (var i in s.data[t]) s.data[t][i].amount = 0, !1 !== (e = n(s.data[t][i].id)) && (s.data[t][i].amount = e.amount, e.visible = !1)
                    }()
                }
                return e
            }();
            for (var a in t) $("#ss-cartaddit-el-" + t[a]).length > 0 && new Vue({
                el: "#ss-cartaddit-el-" + t[a],
                data: {
                    addits: s.data[t[a]]
                },
                methods: {
                    dishes: function(e) {
                        return void 0 !== s.data[e] ? s.data[e] : []
                    },
                    change: function(e, t, o) {
                        var r = i(o, e),
                            s = i(o, r.analogue),
                            a = function() {
                                return t > 0 ? s.max > s.amount ? s.id : e : 0 == r.amount ? s.id : e
                            }(),
                            l = {
                                target: $(".ss-cart-" + a).find("input")[0]
                            };
                        console.log(r, a), a == r.id && i(o, a).amount + t <= 0 ? this.destroy(o, a, !1) : (ssCart(l).setID(a).change(t).save("replace"), i(o, a).amount = n(a).amount)
                    },
                    toggle: function(e, t) {
                        var o = {
                            target: $(".ss-cart-" + e)[0]
                        };
                        0 == i(t, e).amount ? (ssCart(o).setID(e).change(1).save("replace"), i(t, e).amount = n(e).amount) : this.destroy(t, e)
                    },
                    destroy: function(t, n, o) {
                        o = void 0 === o || o;
                        var r = i(t, n),
                            s = i(t, r.analogue);
                        !1 !== r && (e.setID(r.id).destroy(), i(t, r.id).amount = 0), !1 !== s && !0 === o && (e.setID(s.id).destroy(), i(t, s.id).amount = 0)
                    },
                    amount: function(e, t) {
                        t = void 0 === t ? "all" : t;
                        var n = function() {
                                var t = i(o(e), e);
                                return !1 !== t ? t : {
                                    amount: 0
                                }
                            }(),
                            r = function() {
                                var t = i(o(e), e),
                                    n = i(o(e), t.analogue);
                                return !1 !== n ? n : {
                                    amount: 0
                                }
                            }();
                        switch (t) {
                            case "all":
                                return n.amount + r.amount;
                            case "current":
                                return n.amount;
                            case "analogue":
                                return r.amount
                        }
                    },
                    sum: function(e, t) {
                        var n = e * t;
                        switch (/\./.test(parseFloat(n))) {
                            case !1:
                                return r(n, 0, ".", " ");
                            default:
                                return r(n, 2, ".", " ")
                        }
                    }
                }
            })
        },
        n = function(t) {
            for (var n in e.data)
                if (e.data[n].id == t) return e.data[n];
            return !1
        },
        i = function(e, t) {
            for (var n in s.data)
                if (n == e)
                    for (var i in s.data[n])
                        if (s.data[n][i].id == t) return s.data[n][i];
            return !1
        },
        o = function(e) {
            for (var t in s.data)
                for (var n in s.data[t])
                    if (s.data[t][n].id == e) return t;
            return !1
        },
        r = function(e, t, n, i) {
            var o, r, s, a, l;
            return isNaN(t = Math.abs(t)) && (t = 2), void 0 === n && (n = ","), void 0 === i && (i = "."), o = parseInt(e = (+e || 0).toFixed(t)) + "", r = o.length > 3 ? o.length % 3 : 0, l = r ? o.substr(0, r) + i : "", s = o.substr(r).replace(/(\d{3})(?=\d)/g, "$1" + i), a = t ? n + Math.abs(e - o).toFixed(t).replace(/-/, 0).slice(2) : "", l + s + a
        },
        s = this
}

function ssPromocode(e) {
    return null === ssPromocodeVariable && (ssPromocodeVariable = new ssPromocodeClass, void 0 !== e && void 0 !== e.csrf_token && (ssPromocodeVariable.csrf_token = e.csrf_token), void 0 !== e && void 0 !== e.box && (ssPromocodeVariable.box = e.box), void 0 !== e && void 0 !== e.data && (ssPromocodeVariable.data = JSON.parse(e.data)), ssPromocodeVariable.load()), ssPromocodeVariable
}

function ssPromocodeClass() {
    this.csrf_token, this.box, this.data;
    var e, t = "/ajax/promocode/";
    this.load = function() {
        var e = l.box.replace(/^[\.\#]{1}/, ""),
            n = ["list", "mini-list", "promocodes"];
        $.get(t, {}, function(t) {
            var i = $(t);
            for (var o in n) $("#" + e + "-load-" + n[o]).length > 0 && $("#" + e + "-load-" + n[o]).replaceWith(i.find("#" + e + "-load-" + n[o]).html());
            r(), $("body").trigger("ss.loaded.promocode", [l])
        }, "html")
    }, this.add = function() {
        $.post(t, {
            _token: l.csrf_token,
            code: $(l.box + "-code").val()
        }).done(function(t) {
            if (e.promocodes.push(t.code), l.data.push(t), "gift" == t.type && null !== t.gifts)
                for (var n in t.gifts) e.data.push(t.gifts[n]);
            if ("discount" == t.type && null !== t.discounts)
                for (var i in t.discounts) {
                    e.discounts.push(t.discounts[i]);
                    for (var o in e.data) e.data[o].id == t.discounts[i].id && e.correctPrice(e.data[o].id, parseFloat("-" + t.discounts[i].value))
                }
            $(l.box + "-code").val(""), $(l.box + "-success").val(t.code), $(l.box + "-success-box").removeAttr("hidden"), $(l.box + "-code-box").attr("hidden", !0), setTimeout(function() {
                $(l.box + "-success-box").attr("hidden", !0), $(l.box + "-code-box").removeAttr("hidden")
            }, 1500), e.bus.$emit("cart-change"), $("body").trigger("ss.save.cart", [e]), $("body").trigger("ss.added.promocode", [l, t]), e.setPush(!0)
        }).fail(function(e) {
            alert(JSON.parse(e.responseText).message)
        })
    }, this.remove = function(t, i) {
        t = void 0 === t ? e.promocodes[0] : t, i = void 0 === i, !0 === i && e.setPush(!1), !0 === n(t) && (function() {
            for (var n in e.promocodes) e.promocodes[n] == t && delete e.promocodes[n];
            a(e.promocodes);
            for (var i in l.data)
                if (l.data[i].code == t && null !== l.data[i].gifts)
                    for (var o in l.data[i].gifts)
                        for (var r in e.data) e.data[r].id == l.data[i].gifts[o].id && delete e.data[r];
            a(e.data);
            for (var i in e.discounts)
                if (e.discounts[i].code == t) {
                    for (var r in e.data) e.data[r].id == e.discounts[i].id && e.correctPrice(e.data[r].id, e.discounts[i].value);
                    delete e.discounts[i]
                }
            a(e.discounts)
        }(), function() {
            for (var e in l.data) l.data[e].code == t && delete l.data[e];
            a(l.data)
        }()), !0 === i && (e.bus.$emit("cart-change"), $("body").trigger("ss.save.cart", [e]), e.setPush(!0))
    }, this.check = function(n) {
        $("body").trigger("ss.check.promocode", [l]), $.post(t + "/check", {
            _token: l.csrf_token,
            codes: n
        }, function(t) {
            if ($("body").trigger("ss.checked.promocode", [l, t]), t.fail.length > 0) {
                var n = [];
                for (var i in t.fail) l.remove(t.fail[i].code, !1), n.push(t.fail[i].code + ": " + t.fail[i].message);
                alert(n.join("\n")), e.bus.$emit("cart-change"), $("body").trigger("ss.save.cart", [e]), e.setPush(!0)
            }
        }, "json")
    };
    var n = function(t) {
            for (var n in e.promocodes)
                if (e.promocodes[n] == t) return !0;
            return !1
        },
        i = function(t) {
            for (var n in e.data)
                if (e.data[n].id == t) return e.data[n];
            return !1
        },
        o = function(e, t) {
            for (var n in l.data)
                if (l.data[n].code == e)
                    for (var i in l.data[n].gifts)
                        if (l.data[n].gifts[i].id == t) return l.data[n].gifts[i];
            return !1
        },
        r = function() {
            var t = l.box.replace(/^[\.\#]{1}/, ""),
                n = ["list", "mini-list"],
                r = ["promocodes"];
            e = ssCart(ssCartVariable.event), e.promocodes = function() {
                var e = [];
                for (var t in l.data) e.push(l.data[t].code),
                    function() {
                        var e;
                        if ("gift" == l.data[t].type && null !== l.data[t].gifts)
                            for (var n in l.data[t].gifts) l.data[t].gifts[n].amount = 0, !1 !== (e = i(l.data[t].gifts[n].id)) && (l.data[t].gifts[n].amount = e.amount, e.visible = !1)
                    }();
                return $(l.box + "-code-box").removeAttr("hidden"), e
            }(), e.discounts = function() {
                var e = [];
                for (var t in l.data)
                    if ("discount" == l.data[t].type && null !== l.data[t].discounts)
                        for (var n in l.data[t].discounts) e.push({
                            id: l.data[t].discounts[n].id,
                            value: l.data[t].discounts[n].value,
                            code: l.data[t].code
                        });
                return e
            }();
            for (var a in n) $("#" + t + "-el-" + n[a]).length > 0 && new Vue({
                el: "#" + t + "-el-" + n[a],
                data: {
                    promocodes: l.data
                },
                methods: {
                    change: function(e, t, n, r) {
                        o(r, t).amount + n <= o(r, t).quantity && (ssCart(e).setID(t).change(n).save("replace"), o(r, t).amount = i(t).amount)
                    },
                    destroy: function(t, n) {
                        e.setID(n).destroy(), o(t, n).amount = 0
                    },
                    sum: function(e, t) {
                        var n = e * t;
                        switch (/\./.test(parseFloat(n))) {
                            case !1:
                                return s(n, 0, ".", " ");
                            default:
                                return s(n, 2, ".", " ")
                        }
                    }
                }
            });
            for (var a in r) $("#" + t + "-el-" + r[a]).length > 0 && new Vue({
                el: "#" + t + "-el-" + r[a],
                data: {
                    promocodes: l.data
                },
                methods: {
                    has: function() {
                        return this.promocodes.length > 0
                    },
                    remove: function(e) {
                        l.remove(e)
                    }
                }
            });
            $("body").bind("ss.loaded.promocode", function(t) {
                e.promocodes.length > 0 && l.check(e.promocodes)
            }), $("body").bind("ss.push.after.cart", function(e, t) {
                t.promocodes.length > 0 && l.check(t.promocodes)
            }), e.reLoad()
        },
        s = function(e, t, n, i) {
            var o, r, s, a, l;
            return isNaN(t = Math.abs(t)) && (t = 2), void 0 === n && (n = ","), void 0 === i && (i = "."), o = parseInt(e = (+e || 0).toFixed(t)) + "", r = o.length > 3 ? o.length % 3 : 0, l = r ? o.substr(0, r) + i : "", s = o.substr(r).replace(/(\d{3})(?=\d)/g, "$1" + i), a = t ? n + Math.abs(e - o).toFixed(t).replace(/-/, 0).slice(2) : "", l + s + a
        },
        a = function(e) {
            var t = [];
            for (var n in e) void 0 !== e[n] && t.push(e[n]);
            e.splice(0, e.length);
            for (var n in t) e.push(t[n])
        },
        l = this
}

function ssConstructor(e) {
    return null === ssConstructorVariable && (ssConstructorVariable = new ssConstructorClass), void 0 !== e && void 0 !== e.blocks && (ssConstructorVariable.blocks = e.blocks), void 0 !== e && void 0 !== e.url && (ssConstructorVariable.url = e.url), ssConstructorVariable
}

function ssConstructorClass() {
    var e, t = {};
    this.blocks, this.url;
    var n = function() {
            var n = 0,
                i = [];
            for (var o in t) n++;
            if (n == e.blocks) {
                for (var o in t) i.push(t[o]);
                $.get(e.url, {
                    elements: i
                }, function(e) {
                    $("body").trigger("ss.reload.constructor", e)
                }, "html")
            }
        },
        i = function(e) {
            var n = e.attr("data-ss-constructor-block"),
                i = e.val();
            t[n] = i
        };
    e = this,
        function() {
            $("*[data-ss-constructor-block]").bind("change", function() {
                i($(this)), n()
            }), $("body").trigger("ss.inited.constructor")
        }()
}

function ssAddress(e) {
    return null === ssAddressVariable && (ssAddressVariable = new ssAddressClass), void 0 === e ? ssAddressVariable.row(null) : ssAddressVariable.row(e)
}

function ssAddressClass() {
    var e = null;
    this.row = function(n) {
        return e = n, t
    }, this.add = function() {
        var e = $($(".ss-address-template").html()),
            t = 0;
        $("*[class*='ss-address-']").each(function() {
            /ss\-address\-[0-9]+/.test($(this).attr("class")) && t++
        }), e.addClass("ss-address-" + t), e.find(".ss-address-remove").attr("onclick", "ssAddress(" + t + ").remove();"), $(".ss-address-list").prepend(e)
    }, this.remove = function() {
        $(".ss-address-" + e).remove()
    };
    var t = this
}

function recaptchaCallback() {
    $(".ss-recaptcha").each(function() {
        var e = $(this).attr("data-ss-recaptcha-slug"),
            t = $(this).attr("data-ss-recaptcha-key");
        ssRecaptchaVariable[e] = grecaptcha.render($(this)[0], {
            sitekey: t
        })
    })
}

function ssDeals() {
    return null === ssDealVariable && (ssDealVariable = new ssDealSingletonClass), ssDealVariable
}

function ssDealSingletonClass() {
    var e = {};
    this.handler = function() {
        for (var t in e) e[t].hide(), e[t].handler(), e[t].show()
    }, this.setDeal = function(t) {
        if (void 0 === e[t.slug]) {
            var n = new ssDealClass(t);
            e[t.slug] = n;
            var i;
            for (var o in n.products) !1 !== (i = n.getProductFromCart(n.products[o])) && (i.visible = !1)
        }
    }, this.deal = function(t) {
        return void 0 !== e[t] ? e[t] : null
    }, this.getDeals = function() {
        return e
    }
}

function ssDealClass(e) {
    this.products = e.products, this.dataset = void 0 === e.dataset ? {} : e.dataset, this.slug = e.slug;
    var t = e.condition,
        n = e.handler,
        i = e.show,
        o = e.hide,
        r = e.sum;
    this.isActive = function() {
        return t(s)
    }, this.handler = function() {
        n(s)
    }, this.show = function() {
        i(s)
    }, this.hide = function() {
        o(s)
    }, this.sum = function() {
        return r(s)
    }, this.getDeal = function(e) {
        return ssDeals().deal(e)
    }, this.getProductFromCart = function(e) {
        for (var t in ssCart(ssCartVariable.event).data)
            if (ssCart(ssCartVariable.event).data[t].id == e) return ssCart(ssCartVariable.event).data[t];
        return !1
    };
    var s = this
}

function ssDeal59Class() {
    this.products = [], this.dataset = {}, this.slug = "59", this.condition = function(e) {
        var t = ((new Date).getDay(), Math.floor(e.sum() / e.dataset.condition)),
            n = e.getProductFromCart(e.products[0]);
        return t > (!1 !== n ? n.amount : 0)
    }, this.handler = function(e) {
        var t = Math.floor(e.sum() / e.dataset.condition),
            n = function() {
                var t;
                return !1 === (t = e.getProductFromCart(e.products[0])) ? {
                    amount: 0
                } : t
            }();
        if (t < n.amount)
            if (0 == t)
                for (var i in ssCart(ssCartVariable.event).data) ssCart(ssCartVariable.event).data[i].id == n.id && (ssCart(ssCartVariable.event).data.splice(i, 1), ssCart(ssCartVariable.event).bus.$emit("cart-change"), $(ssCart(ssCartVariable.event).name + "-" + n.id).find("input").val(0));
            else
                for (var o in ssCart(ssCartVariable.event).data) ssCart(ssCartVariable.event).data[o].id == n.id && (ssCart(ssCartVariable.event).data[o].amount = t, $(ssCart(ssCartVariable.event).name + "-" + n.id).find("input").val(t))
    }, this.sum = function(e) {
        var t, n, i = function() {
                var e = 0;
                for (var t in ssCart(ssCartVariable.event).data) e += ssCart(ssCartVariable.event).data[t].price * ssCart(ssCartVariable.event).data[t].amount;
                return e
            }(),
            o = e.getDeal("1p1");
        for (var r in o.products) !1 !== (t = e.getProductFromCart(o.products[r])) && (n = e.getProductFromCart(o.dataset.condition[o.products[r]]), i -= n.price * (2 * t.amount));
        !1 !== (t = e.getProductFromCart(e.products[0])) && (i -= t.price * t.amount);
        for (var s in e.dataset.exceptions) !1 !== (n = e.getProductFromCart(e.dataset.exceptions[s])) && (i -= n.price * n.amount);
        return i
    }, this.show = function(e) {
        if (e.isActive() || !1 !== e.getProductFromCart(e.products[0])) {
            $(".ss-deal-" + e.slug).removeAttr("hidden");
            var t = function() {
                var t;
                return !1 === (t = e.getProductFromCart(e.products[0])) ? {
                    amount: 0,
                    price: 0
                } : t
            }();
            $(".ss-deal-" + e.slug).find(ssCart(ssCartVariable.event).name + "-" + e.products[0]).find(".ss-deal-price-total").text(t.price * t.amount), $(".ss-deal-" + e.slug).find(ssCart(ssCartVariable.event).name + "-" + e.products[0]).removeAttr("hidden")
        }
    }, this.hide = function(e) {
        $(".ss-deal-" + e.slug).attr("hidden", !0), $(".ss-deal-" + e.slug).find(ssCart(ssCartVariable.event).name + "-" + e.products[0]).attr("hidden", !0)
    }
}

function ssDeal1p1Class() {
    this.products = [], this.dataset = {
        sum: function(e, t) {
            var n, i, o = e.sum();
            for (var r in e.products) t != e.dataset.condition[e.products[r]] && !1 !== (n = e.getProductFromCart(e.products[r])) && (i = e.getProductFromCart(e.dataset.condition[e.products[r]]), o -= i.price * (2 * n.amount));
            return o
        }
    }, this.slug = "1p1", this.condition = function(e) {
        var t, n, i;
        for (var o in e.dataset.condition)
            if (!1 !== (i = e.getProductFromCart(e.dataset.condition[o])) && i.amount > 1) {
                if (void 0 !== e.dataset.product_id && null !== e.dataset.product_id && e.dataset.product_id != o) continue;
                if (t = e.dataset.sum(e, i.id), n = function() {
                        return !1 === (n = e.getProductFromCart(o)) ? {
                            id: 0,
                            amount: 0
                        } : n
                    }(), Math.floor((i.price * i.amount < t ? i.price * i.amount : t) / (2 * i.price)) > n.amount) return !0
            }
        return !1
    }, this.handler = function(e) {
        var t, n;
        for (var i in e.dataset.condition)
            if (!1 !== (t = e.getProductFromCart(i)) && (n = function() {
                    var t, n = e.dataset.sum(e, e.dataset.condition[i]),
                        o = 0;
                    return !1 === (t = e.getProductFromCart(e.dataset.condition[i])) ? o : o = Math.floor((t.price * t.amount < n ? t.price * t.amount : n) / (2 * t.price))
                }()) < t.amount)
                if (0 == n)
                    for (var o in ssCart(ssCartVariable.event).data) ssCart(ssCartVariable.event).data[o].id == t.id && (ssCart(ssCartVariable.event).data.splice(o, 1), $(ssCart(ssCartVariable.event).name + "-" + t.id).find("input").val(0));
                else
                    for (var r in ssCart(ssCartVariable.event).data) ssCart(ssCartVariable.event).data[r].id == t.id && (ssCart(ssCartVariable.event).data[r].amount = n, $(ssCart(ssCartVariable.event).name + "-" + t.id).find("input").val(n))
    }, this.sum = function(e) {
        var t, n, i = function() {
                var e = 0;
                for (var t in ssCart(ssCartVariable.event).data) e += ssCart(ssCartVariable.event).data[t].price * ssCart(ssCartVariable.event).data[t].amount;
                return e
            }(),
            o = e.getDeal("59");
        !1 !== (t = e.getProductFromCart(o.products[0])) && (i -= t.price * t.amount + o.dataset.condition * t.amount);
        for (var r in e.dataset.exceptions) !1 !== (n = e.getProductFromCart(e.dataset.exceptions[r])) && (i -= n.price * n.amount);
        return i
    }, this.show = function(e) {
        if (e.isActive() || !1 !== function() {
                for (var t in e.products)
                    if (!1 !== e.getProductFromCart(e.products[t])) return !0;
                return !1
            }()) {
            $(".ss-deal-" + e.slug).removeAttr("hidden");
            for (var t in e.dataset.condition)
                if (!0 === function() {
                        var n, i;
                        return !1 !== e.getProductFromCart(t) || !1 !== (n = e.getProductFromCart(e.dataset.condition[t])) && n.amount > 1 && (i = e.dataset.sum(e, n.id), Math.floor((n.price * n.amount < i ? n.price * n.amount : i) / (2 * n.price)) > 0)
                    }()) {
                    var n = function() {
                        var n;
                        return !1 === (n = e.getProductFromCart(t)) ? {
                            amount: 0,
                            price: 0
                        } : n
                    }();
                    $(".ss-deal-" + e.slug).find(ssCart(ssCartVariable.event).name + "-" + t).find(".ss-deal-price-total").text(n.price * n.amount), $(".ss-deal-" + e.slug).find(ssCart(ssCartVariable.event).name + "-" + t).removeAttr("hidden")
                }
        }
    }, this.hide = function(e) {
        $(".ss-deal-" + e.slug).attr("hidden", !0);
        for (var t in e.products) $(".ss-deal-" + e.slug).find(ssCart(ssCartVariable.event).name + "-" + e.products[t]).attr("hidden", !0)
    }
}

function ssSM() {
    this.toggle = function(e) {
        var t = e.parents("li").eq(0).find("> ul");
        t.hasClass("hidden") ? (t.removeClass("hidden"), e.removeClass("plus"), e.addClass("minus"), e.text("-")) : (t.addClass("hidden"), e.removeClass("minus"), e.addClass("plus"), e.text("+"))
    }
}

function ssSearch(e) {
    this.ms = void 0 != e.mc ? e.mc : 300, this.obj = $(e.obj), this.ajaxPath = e.ajaxPath, this.token = e.token, this.notFound = void 0 != e.notFound ? e.notFound : "Ничего не найдено", this.keyBoard = ".ss-search-keyboard-name", this.inputSearch = ".ss-search-field", this.inputResult = ".ss-search-select-result", this.listBox = ".ss-search-list-box", this.list = ".ss-search-list", this.field = void 0 != e.field ? e.field : null, this.fields = {}, this.mode = "server";
    var t = [],
        n = void 0 != e.exceptions && "" != e.exceptions ? e.exceptions.split(",") : [];
    this.init = function() {
        r.obj.find(r.inputResult).bind("focus", function() {
            r.toggle()
        }), r.obj.find(r.inputSearch).bind("input keydown", function(e) {
            r.run(e)
        }), r.obj.find(r.inputSearch).blur(function() {
            setTimeout(function() {
                r.close()
            }, r.ms)
        }), r.obj.find(r.listBox).bind("mouseover", function() {
            r.overBox()
        }), r.obj.find(r.listBox).bind("mouseout", function() {
            r.outBox()
        }), r.obj.trigger("ss.inited.search")
    }, this.run = function(e) {
        var t = e.keyCode;
        return r.obj.trigger("ss.run.search"), !(8 != t && 13 != t && 27 != t && 32 != t && 38 != t && 40 != t && 46 != t && (t < 48 || t > 90) && (t > 111 || t < 96) && (t < 186 || t > 192) && 220 != t && 222 != t) && (38 == t ? (r.up(), !0) : 40 == t ? (r.down(), !0) : 13 == t ? (r.enter(), !0) : 27 == t ? (r.close(), !0) : (r.reLoad(), !0))
    }, this.reLoad = function() {
        r.obj.find(r.keyBoard).text(r.obj.find(r.inputSearch).val()), o().split("").length < 2 ? (r.mode = "server", i(t = [])) : r.hasBusy() || (r.addBusy(), "server" == r.mode ? setTimeout(function() {
            r.load()
        }, r.ms) : setTimeout(function() {
            r.local()
        }, r.ms))
    }, this.enter = function() {
        var e = function(e, t) {
            return r.obj.find(r.list + " ul li.active").length > 0 ? r.obj.find(r.list + " ul li.active .ss-search-ajax-" + e).text() : 1 == r.obj.find(r.list + " ul li").length && 1 == r.obj.find(r.list + " ul li .ss-search-ajax-" + e).length ? r.obj.find(r.list + " ul li .ss-search-ajax-" + e).text() : void 0 !== t ? t : null
        };
        if (r.obj.hasClass("ss-search-bind-select")) r.obj.trigger("ss.select.search", [e]);
        else {
            var t = e("text", r.obj.find(r.keyBoard).text()),
                n = e("id", 0);
            r.toggle(), r.obj.find(r.inputResult).val(n > 0 ? t : ""), r.obj.find("input[type='hidden']").val(n)
        }
        r.obj.trigger("ss.enter.search")
    }, this.up = function() {
        var e = r.obj.find(r.list + " ul li").length;
        return !("" == r.obj.find(r.list + " ul").text() || r.obj.find(r.list + " ul li.ss-search-notfound").length > 0) && (0 == r.obj.find(r.list + " ul li.active").length ? r.obj.find(r.list + " ul li:eq(" + (e - 1) + ")").addClass("active") : r.obj.find(r.list + " ul li.active").removeClass("active").prev().addClass("active"), r.scroll(), r.obj.trigger("ss.up.search"), !0)
    }, this.down = function() {
        return !(r.obj.find(r.list + " ul li.ss-search-notfound").length > 0) && (0 == r.obj.find(r.list + " ul li.active").length ? r.obj.find(r.list + " ul li:eq(0)").addClass("active") : r.obj.find(r.list + " ul li.active").removeClass("active").next().addClass("active"), r.scroll(), r.obj.trigger("ss.down.search"), !0)
    }, this.overPoint = function(e) {
        e.hasClass("ss-search-notfound") || (r.obj.find(r.list + " ul li").removeClass("active"), e.addClass("active")), r.obj.trigger("ss.overpoint.search")
    }, this.overBox = function(e) {
        r.obj.find(r.listBox).addClass("ss-search-box-over"), r.obj.trigger("ss.overbox.search")
    }, this.outBox = function(e) {
        r.obj.find(r.listBox).removeClass("ss-search-box-over"), r.obj.trigger("ss.outbox.search")
    }, this.local = function() {
        var e = o(),
            n = [];
        r.obj.trigger("ss.load.search");
        for (var s in t) - 1 !== t[s].value.toLowerCase().indexOf(e.toLowerCase()) && n.push(t[s]);
        i(n), r.obj.trigger("ss.loaded.search", [n]), r.removeBusy()
    }, this.load = function() {
        return r.mode = "local", r.fields._token = r.token, r.fields.value = o(), r.fields.field = r.field, r.obj.trigger("ss.load.search"), $.post(r.ajaxPath, r.fields, function(e) {
            t = e, i(e), r.obj.trigger("ss.loaded.search", [e]), r.removeBusy()
        }, "json"), !0
    }, this.toggle = function() {
        r.obj.find(r.inputResult).blur(), "none" == r.obj.find(r.listBox).css("display") ? (r.obj.trigger("ss.toggle-open.search"), r.obj.find(r.listBox).css("display", "block"), r.obj.find(r.inputSearch).focus(), r.position()) : (r.obj.trigger("ss.toggle-close.search"), r.obj.find(r.listBox).css("display", "none"), r.obj.find(r.inputSearch).blur()), r.obj.trigger("ss.toggled.search")
    }, this.close = function() {
        "none" == r.obj.find(r.listBox).css("display") || r.obj.find(r.listBox).hasClass("ss-search-box-over") || r.toggle()
    }, this.scroll = function() {
        var e = [r.obj.find(r.list).scrollTop(), r.obj.find(r.list).scrollTop() + r.obj.find(r.list).innerHeight()];
        if (0 != r.obj.find(r.list + " ul li.active").length) {
            var t = function() {
                    var e = 0 + r.obj.find(r.list + " ul li.active").offset().top - r.obj.find(r.list + " ul").offset().top;
                    return parseInt(e)
                },
                n = function() {
                    var e = 0 + r.obj.find(r.list + " ul li.active").offset().top - r.obj.find(r.list + " ul").offset().top + r.obj.find(r.list + " ul li.active").innerHeight();
                    return parseInt(e)
                };
            t() < e[0] && n() <= e[0] && r.obj.find(r.list).scrollTop(t()), t() >= e[1] && n() > e[1] && r.obj.find(r.list).scrollTop(n() - r.obj.find(r.list).innerHeight())
        }
    }, this.position = function() {
        r.obj.find(r.list + " ul li").css({
            height: "auto"
        }), r.obj.find(r.list + " ul li").each(function() {
            $(this).css({
                height: parseInt($(this).innerHeight())
            })
        }), r.obj.find(r.list).css({
            height: function() {
                var e = 0;
                return r.obj.find(r.list + " ul li").each(function(t) {
                    if (t >= 10) return !1;
                    e += $(this).innerHeight()
                }), e > 0 && (e += 0 + parseInt(r.obj.find(r.list).css("border-top-width")) + parseInt(r.obj.find(r.list).css("border-bottom-width"))), e
            }()
        })
    }, this.bind = function(e, t) {
        return this.obj.bind("ss." + e + ".search", t), this.obj.addClass("ss-search-bind-" + e), this
    }, this.addField = function(e, t) {
        return this.fields[e] = t, this
    }, this.addBusy = function() {
        this.obj.find(this.inputSearch).addClass("ss-search-busy")
    }, this.removeBusy = function() {
        this.obj.find(this.inputSearch).removeClass("ss-search-busy")
    }, this.hasBusy = function() {
        return this.obj.find(this.inputSearch).hasClass("ss-search-busy")
    };
    var i = function(e) {
            var t = "";
            if (r.obj.find(r.list).scrollTop(0), r.obj.find(r.list + " ul").html(""), r.obj.find(r.list + " ul li").unbind("click"), r.obj.find(r.list + " ul li").unbind("mouseover"), e.length > 0)
                for (index in e) {
                    t = "<li>";
                    for (field in e[index]) "value" == field ? t += "<span class='ss-search-ajax-text'>" + e[index].value + "</span>" : t += "<span class='ss-search-ajax-" + field + "' hidden>" + e[index][field] + "</span>";
                    t += "</li>", r.obj.find(r.list + " ul").append(t)
                } else 0 == r.obj.find(r.list + " ul li").length && r.obj.find(r.list + " ul").html("<li class='ss-search-notfound'>" + r.notFound + "</li>");
            r.obj.find(r.list + " ul li").bind("click", function() {
                r.enter()
            }), r.obj.find(r.list + " ul li").bind("mouseover", function() {
                r.overPoint($(this))
            }), r.position()
        },
        o = function() {
            return 0 !== function() {
                var e = r.obj.find(r.inputSearch).val().toLowerCase().split(""),
                    t = function() {
                        var e = [];
                        for (var t in n) e[t] = n[t];
                        return e
                    }();
                for (var i in e) {
                    if (" " == e[i] || "." == e[i]) break;
                    for (var o in t) t[o].split("")[i] != e[i] && delete t[o]
                }
                return function() {
                    var e = [];
                    for (var n in t) void 0 !== t[n] && e.push(t[n]);
                    return e
                }().length
            }() ? /\s/.test(r.obj.find(r.inputSearch).val()) ? r.obj.find(r.inputSearch).val().replace(/^.*?[\s\.]{1}/gi, "") : "" : r.obj.find(r.inputSearch).val()
        },
        r = this
}! function(e) {
    "function" == typeof define && define.amd ? define(["shoestring"], e) : "object" == typeof module && module.exports ? module.exports = e() : e()
}(function() {
    function e(t, n) {
        var i, o = typeof t,
            r = [];
        if (!t) return new l(r);
        if (t.call) return e.ready(t);
        if (t.constructor === l && !n) return t;
        if ("string" === o && 0 === t.indexOf("<")) {
            var c = a.createElement("div");
            return c.innerHTML = t, e(c).children().each(function() {
                c.removeChild(this)
            })
        }
        return "string" === o ? n ? e(n).find(t) : (i = a.querySelectorAll(t), new l(i, t)) : "[object Array]" === Object.prototype.toString.call(o) || s.NodeList && t instanceof s.NodeList ? new l(t, t) : t.constructor === Array ? new l(t, t) : new l([t], t)
    }

    function t(e, t) {
        var n = !1;
        return e.each(function() {
            for (var e = 0; e < t.length;) this === t[e] && (n = !0), e++
        }), n
    }

    function n(e, t) {
        e.shoestringData || (e.shoestringData = {}), e.shoestringData.events || (e.shoestringData.events = {}), e.shoestringData.loop || (e.shoestringData.loop = {}), e.shoestringData.events[t] || (e.shoestringData.events[t] = [])
    }

    function i(e, t, n) {
        var i = {};
        i.isCustomEvent = n.isCustomEvent, i.callback = n.callfunc, i.originalCallback = n.originalCallback, i.namespace = n.namespace, e.shoestringData.events[t].push(i), n.customEventLoop && (e.shoestringData.loop[t] = n.customEventLoop)
    }

    function o(e, t, n) {
        var i = this.shoestringData.events[e];
        if (i && i.length) {
            var o, r, s = [];
            for (o = 0, r = i.length; o < r; o++) t && t !== i[o].namespace || void 0 !== n && n !== i[o].originalCallback || (this.removeEventListener(e, i[o].callback, !1), s.push(o));
            for (o = 0, r = s.length; o < r; o++) this.shoestringData.events[e].splice(o, 1)
        }
    }

    function r(e, t) {
        for (var n in this.shoestringData.events) o.call(this, n, e, t)
    }
    var s = "undefined" != typeof window ? window : this,
        a = s.document,
        l = function(t, n) {
            this.length = 0, this.selector = n, e.merge(this, t)
        };
    l.prototype.reverse = [].reverse, e.fn = l.prototype, e.Shoestring = l, e.extend = function(e, t) {
        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
        return e
    }, e.merge = function(e, t) {
        var n, i, o;
        for (n = +t.length, i = 0, o = e.length; i < n; i++) e[o++] = t[i];
        return e.length = o, e
    }, s.shoestring = e, e.fn.each = function(t) {
        return e.each(this, t)
    }, e.each = function(e, t) {
        for (var n = 0, i = e.length; n < i && !1 !== t.call(e[n], n, e[n]); n++);
        return e
    }, e.inArray = function(e, t) {
        for (var n = -1, i = 0, o = t.length; i < o; i++) t.hasOwnProperty(i) && t[i] === e && (n = i);
        return n
    }, e.ready = function(e) {
        return c && e ? e.call(a) : e ? d.push(e) : u(), [a]
    }, e.fn.ready = function(t) {
        return e.ready(t), this
    };
    var c = !1,
        d = [],
        u = function() {
            if (!c) {
                for (; d.length;) d.shift().call(a);
                c = !0
            }
        };
    (a.attachEvent ? "complete" === a.readyState : "loading" !== a.readyState) ? u(): (a.addEventListener("DOMContentLoaded", u, !1), a.addEventListener("readystatechange", u, !1), s.addEventListener("load", u, !1)), e.fn.is = function(n) {
            var i, o, r = !1,
                s = this;
            return "string" != typeof n ? (o = n.length && n[0] ? n : [n], t(this, o)) : (i = this.parent(), i.length || (i = e(a)), i.each(function(e, i) {
                var o;
                o = i.querySelectorAll(n), r = t(s, o)
            }), r)
        }, e.fn.data = function(e, t) {
            return void 0 === e ? this[0] ? this[0].shoestringData || {} : void 0 : void 0 !== t ? this.each(function() {
                this.shoestringData || (this.shoestringData = {}), this.shoestringData[e] = t
            }) : this[0] && this[0].shoestringData ? this[0].shoestringData[e] : void 0
        }, e.fn.removeData = function(e) {
            return this.each(function() {
                void 0 !== e && this.shoestringData ? (this.shoestringData[e] = void 0, delete this.shoestringData[e]) : this[0].shoestringData = {}
            })
        }, s.$ = e, e.fn.addClass = function(e) {
            var t = e.replace(/^\s+|\s+$/g, "").split(" ");
            return this.each(function() {
                for (var e = 0, n = t.length; e < n; e++) void 0 === this.className || "" !== this.className && this.className.match(new RegExp("(^|\\s)" + t[e] + "($|\\s)")) || (this.className += " " + t[e])
            })
        }, e.fn.add = function(t) {
            var n = [];
            return this.each(function() {
                n.push(this)
            }), e(t).each(function() {
                n.push(this)
            }), e(n)
        }, e.fn.append = function(t) {
            return "string" != typeof t && void 0 === t.nodeType || (t = e(t)), this.each(function(e) {
                for (var n = 0, i = t.length; n < i; n++) this.appendChild(e > 0 ? t[n].cloneNode(!0) : t[n])
            })
        }, e.fn.appendTo = function(t) {
            return this.each(function() {
                e(t).append(this)
            })
        }, e.fn.attr = function(e, t) {
            var n = "string" == typeof e;
            return void 0 === t && n ? this[0] ? this[0].getAttribute(e) : void 0 : this.each(function() {
                if (n) this.setAttribute(e, t);
                else
                    for (var i in e) e.hasOwnProperty(i) && this.setAttribute(i, e[i])
            })
        }, e.fn.before = function(t) {
            return "string" != typeof t && void 0 === t.nodeType || (t = e(t)), this.each(function(e) {
                for (var n = 0, i = t.length; n < i; n++) this.parentNode.insertBefore(e > 0 ? t[n].cloneNode(!0) : t[n], this)
            })
        }, e.fn.children = function() {
            var t, n, i = [];
            return this.each(function() {
                for (t = this.children, n = -1; n++ < t.length - 1;) - 1 === e.inArray(t[n], i) && i.push(t[n])
            }), e(i)
        }, e.fn.closest = function(t) {
            var n = [];
            return t ? (this.each(function() {
                var i;
                if (e(i = this).is(t)) return void n.push(this);
                for (; i.parentElement;) {
                    if (e(i.parentElement).is(t)) {
                        n.push(i.parentElement);
                        break
                    }
                    i = i.parentElement
                }
            }), e(n)) : e(n)
        }, e.cssExceptions = {
            float: ["cssFloat"]
        },
        function() {
            function t(e) {
                return e.replace(/\-([A-Za-z])/g, function(e, t) {
                    return t.toUpperCase()
                })
            }

            function n(e, t) {
                return s.getComputedStyle(e, null).getPropertyValue(t)
            }
            var i = e.cssExceptions,
                o = ["", "-webkit-", "-ms-", "-moz-", "-o-", "-khtml-"];
            e._getStyle = function(e, r) {
                var s, a, l, c;
                if (i[r])
                    for (l = 0, c = i[r].length; l < c; l++)
                        if (a = n(e, i[r][l])) return a;
                for (l = 0, c = o.length; l < c; l++)
                    if (s = t(o[l] + r), a = n(e, s), s !== r && (a = a || n(e, r)), o[l] && (a = a || n(e, o[l] + r)), a) return a
            }
        }(),
        function() {
            function t(e) {
                return e.replace(/\-([A-Za-z])/g, function(e, t) {
                    return t.toUpperCase()
                })
            }
            var n = e.cssExceptions;
            e._setStyle = function(e, i, o) {
                var r = t(i);
                if (e.style[i] = o, r !== i && (e.style[r] = o), n[i])
                    for (var s = 0, a = n[i].length; s < a; s++) e.style[n[i][s]] = o
            }
        }(), e.fn.css = function(t, n) {
            if (this[0]) return "object" == typeof t ? this.each(function() {
                for (var n in t) t.hasOwnProperty(n) && e._setStyle(this, n, t[n])
            }) : void 0 !== n ? this.each(function() {
                e._setStyle(this, t, n)
            }) : e._getStyle(this[0], t)
        }, e.fn.eq = function(t) {
            return e(this[t] ? this[t] : [])
        }, e.fn.filter = function(t) {
            var n = [];
            return this.each(function(i) {
                var o;
                if ("function" == typeof t) !1 !== t.call(this, i) && n.push(this);
                else {
                    if (this.parentNode) o = e(t, this.parentNode);
                    else {
                        var r = e(a.createDocumentFragment());
                        r[0].appendChild(this), o = e(t, r)
                    }
                    e.inArray(this, o) > -1 && n.push(this)
                }
            }), e(n)
        }, e.fn.find = function(t) {
            var n, i = [];
            return this.each(function() {
                n = this.querySelectorAll(t);
                for (var e = 0, o = n.length; e < o; e++) i = i.concat(n[e])
            }), e(i)
        }, e.fn.first = function() {
            return this.eq(0)
        }, e.fn.get = function(e) {
            if (void 0 === e) {
                for (var t = [], n = 0; n < this.length; n++) t.push(this[n]);
                return t
            }
            return this[e]
        };
    var p = function(e) {
        if ("string" == typeof e || "number" == typeof e) return this.each(function() {
            this.innerHTML = "" + e
        });
        var t = "";
        if (void 0 !== e.length)
            for (var n = 0, i = e.length; n < i; n++) t += e[n].outerHTML;
        else t = e.outerHTML;
        return this.each(function() {
            this.innerHTML = t
        })
    };
    e.fn.html = function(e) {
            if (void 0 !== e) return p.call(this, e);
            var t = "";
            return this.each(function() {
                t += this.innerHTML
            }), t
        },
        function() {
            function t(e, t) {
                var n, i, o;
                for (n = i = 0; n < e.length; n++) {
                    if (o = e.item ? e.item(n) : e[n], t(o)) return i;
                    1 === o.nodeType && i++
                }
                return -1
            }
            e.fn.index = function(n) {
                var i, o;
                return i = this, void 0 === n ? (o = (this[0] && this[0].parentNode || a.documentElement).childNodes, t(o, function(e) {
                    return i[0] === e
                })) : t(i, function(t) {
                    return t === e(n, t.parentNode)[0]
                })
            }
        }(), e.fn.insertBefore = function(t) {
            return this.each(function() {
                e(t).before(this)
            })
        }, e.fn.last = function() {
            return this.eq(this.length - 1)
        }, e.fn.next = function() {
            var t = [];
            return this.each(function() {
                var n, i, o;
                n = e(this.parentNode)[0].childNodes;
                for (var r = 0; r < n.length; r++) {
                    if (i = n.item(r), o && 1 === i.nodeType) {
                        t.push(i);
                        break
                    }
                    i === this && (o = !0)
                }
            }), e(t)
        }, e.fn.not = function(t) {
            var n = [];
            return this.each(function() {
                var i = e(t, this.parentNode); - 1 === e.inArray(this, i) && n.push(this)
            }), e(n)
        }, e.fn.parent = function() {
            var t, n = [];
            return this.each(function() {
                (t = this === a.documentElement ? a : this.parentNode) && 11 !== t.nodeType && n.push(t)
            }), e(n)
        }, e.fn.prepend = function(t) {
            return "string" != typeof t && void 0 === t.nodeType || (t = e(t)), this.each(function(e) {
                for (var n = 0, i = t.length; n < i; n++) {
                    var o = e > 0 ? t[n].cloneNode(!0) : t[n];
                    this.firstChild ? this.insertBefore(o, this.firstChild) : this.appendChild(o)
                }
            })
        }, e.fn.prev = function() {
            var t = [];
            return this.each(function() {
                var n, i, o;
                n = e(this.parentNode)[0].childNodes;
                for (var r = n.length - 1; r >= 0; r--) {
                    if (i = n.item(r), o && 1 === i.nodeType) {
                        t.push(i);
                        break
                    }
                    i === this && (o = !0)
                }
            }), e(t)
        }, e.fn.prevAll = function() {
            var t = [];
            return this.each(function() {
                for (var n = e(this).prev(); n.length;) t.push(n[0]), n = n.prev()
            }), e(t)
        }, e.fn.removeAttr = function(e) {
            return this.each(function() {
                this.removeAttribute(e)
            })
        }, e.fn.removeClass = function(e) {
            var t = e.replace(/^\s+|\s+$/g, "").split(" ");
            return this.each(function() {
                for (var e, n, i = 0, o = t.length; i < o; i++) void 0 !== this.className && (n = new RegExp("(^|\\s)" + t[i] + "($|\\s)", "gmi"), e = this.className.replace(n, " "), this.className = e.replace(/^\s+|\s+$/g, ""))
            })
        }, e.fn.remove = function() {
            return this.each(function() {
                this.parentNode && this.parentNode.removeChild(this)
            })
        }, e.fn.replaceWith = function(t) {
            "string" == typeof t && (t = e(t));
            var n = [];
            return t.length > 1 && (t = t.reverse()), this.each(function(e) {
                var i, o = this.cloneNode(!0);
                if (n.push(o), this.parentNode)
                    if (1 === t.length) i = e > 0 ? t[0].cloneNode(!0) : t[0], this.parentNode.replaceChild(i, this);
                    else {
                        for (var r = 0, s = t.length; r < s; r++) i = e > 0 ? t[r].cloneNode(!0) : t[r], this.parentNode.insertBefore(i, this.nextSibling);
                        this.parentNode.removeChild(this)
                    }
            }), e(n)
        }, e.fn.siblings = function() {
            if (!this.length) return e([]);
            var t = [],
                n = this[0].parentNode.firstChild;
            do {
                1 === n.nodeType && n !== this[0] && t.push(n), n = n.nextSibling
            } while (n);
            return e(t)
        };
    var f = function(e) {
        var t, n = "",
            i = 0,
            o = e.nodeType;
        if (o) {
            if (1 === o || 9 === o || 11 === o) {
                if ("string" == typeof e.textContent) return e.textContent;
                for (e = e.firstChild; e; e = e.nextSibling) n += f(e)
            } else if (3 === o || 4 === o) return e.nodeValue
        } else
            for (; t = e[i++];) n += f(t);
        return n
    };
    return e.fn.text = function() {
        return f(this)
    }, e.fn.val = function(t) {
        var n;
        return void 0 !== t ? this.each(function() {
            if ("SELECT" === this.tagName) {
                var n, i, o, r = this.options,
                    s = [],
                    a = r.length;
                for (s[0] = t; a--;) i = r[a], (i.selected = e.inArray(i.value, s) >= 0) && (n = !0, o = a);
                this.selectedIndex = n ? o : -1
            } else this.value = t
        }) : (n = this[0], "SELECT" === n.tagName ? n.selectedIndex < 0 ? "" : n.options[n.selectedIndex].value : n.value)
    }, e._dimension = function(e, t, n) {
        var i;
        return void 0 === n ? (i = t.replace(/^[a-z]/, function(e) {
            return e.toUpperCase()
        }), e[0]["offset" + i]) : (n = "string" == typeof n ? n : n + "px", e.each(function() {
            this.style[t] = n
        }))
    }, e.fn.width = function(t) {
        return e._dimension(this, "width", t)
    }, e.fn.wrapInner = function(t) {
        return this.each(function() {
            var n = this.innerHTML;
            this.innerHTML = "", e(this).append(e(t).html(n))
        })
    }, e.fn.bind = function(e, t, o) {
        function r(e, n, i) {
            var r;
            if (!e._namespace || e._namespace === n) {
                e.data = t, e.namespace = e._namespace;
                var s = function() {
                    return !0
                };
                e.isDefaultPrevented = function() {
                    return !1
                };
                var a = e.preventDefault;
                return e.target = i || e.target || e.srcElement, e.preventDefault = function() {
                    return a ? function() {
                        e.isDefaultPrevented = s, a.call(e)
                    } : function() {
                        e.isDefaultPrevented = s, e.returnValue = !1
                    }
                }(), e.stopPropagation = e.stopPropagation || function() {
                    e.cancelBubble = !0
                }, r = o.apply(this, [e].concat(e._args)), !1 === r && (e.preventDefault(), e.stopPropagation()), r
            }
        }
        "function" == typeof t && (o = t, t = null);
        var s = e.split(" ");
        return this.each(function() {
            for (var e, t, a, l = this, c = 0, d = s.length; c < d; c++) {
                var u = s[c].split("."),
                    p = u[0],
                    f = u.length > 0 ? u[1] : null;
                e = function(e) {
                    return l.ssEventTrigger && (e._namespace = l.ssEventTrigger._namespace, e._args = l.ssEventTrigger._args, l.ssEventTrigger = null), r.call(l, e, f)
                }, t = null, a = null, n(this, p), this.addEventListener(p, e, !1), i(this, p, {
                    callfunc: t || e,
                    isCustomEvent: !!t,
                    customEventLoop: a,
                    originalCallback: o,
                    namespace: f
                })
            }
        })
    }, e.fn.on = e.fn.bind, e.fn.unbind = function(e, t) {
        var n = e ? e.split(" ") : [];
        return this.each(function() {
            if (this.shoestringData && this.shoestringData.events)
                if (n.length)
                    for (var e, i, s, a = 0, l = n.length; a < l; a++) e = n[a].split("."), i = e[0], s = e.length > 0 ? e[1] : null, i ? o.call(this, i, s, t) : r.call(this, s, t);
                else r.call(this)
        })
    }, e.fn.off = e.fn.unbind, e.fn.one = function(t, n) {
        var i = t.split(" ");
        return this.each(function() {
            for (var t, o = {}, r = e(this), s = 0, a = i.length; s < a; s++) t = i[s], o[t] = function(t) {
                var i = e(this);
                for (var r in o) i.unbind(r, o[r]);
                return n.apply(this, [t].concat(t._args))
            }, r.bind(t, o[t])
        })
    }, e.fn.triggerHandler = function(e, t) {
        var n, i = e.split(" ")[0],
            o = this[0];
        if (a.createEvent && o.shoestringData && o.shoestringData.events && o.shoestringData.events[i]) {
            var r = o.shoestringData.events[i];
            for (var s in r) r.hasOwnProperty(s) && (e = a.createEvent("Event"), e.initEvent(i, !0, !0), e._args = t, t.unshift(e), n = r[s].originalCallback.apply(e.target, t))
        }
        return n
    }, e.fn.trigger = function(e, t) {
        var n = e.split(" ");
        return this.each(function() {
            for (var e, i, o, r = 0, s = n.length; r < s; r++) {
                if (e = n[r].split("."), i = e[0], o = e.length > 0 ? e[1] : null, "click" === i && "INPUT" === this.tagName && "checkbox" === this.type && this.click) return this.click(), !1;
                if (a.createEvent) {
                    var l = a.createEvent("Event");
                    l.initEvent(i, !0, !0), l._args = t, l._namespace = o, this.dispatchEvent(l)
                }
            }
        })
    }, e
}),
function(e, t) {
    "function" == typeof define && define.amd ? define(["shoestring"], function(n) {
        return e.Tablesaw = t(n, e)
    }) : "object" == typeof exports ? module.exports = t(require("shoestring"), e) : e.Tablesaw = t(shoestring, e)
}("undefined" != typeof window ? window : this, function(e, t) {
    "use strict";
    var n = t.document,
        i = !1;
    n.addEventListener("DOMContentLoaded", function() {
        i = !0
    });
    var o = {
        i18n: {
            modeStack: "Stack",
            modeSwipe: "Swipe",
            modeToggle: "Toggle",
            modeSwitchColumnsAbbreviated: "Cols",
            modeSwitchColumns: "Columns",
            columnToggleButton: "Columns",
            columnToggleError: "No eligible columns.",
            sort: "Sort",
            swipePreviousColumn: "Previous column",
            swipeNextColumn: "Next column"
        },
        mustard: "head" in n && (!t.blackberry || t.WebKitPoint) && !t.operamini,
        $: e,
        _init: function(e) {
            o.$(e || n).trigger("enhance.tablesaw")
        },
        init: function(e) {
            i ? o._init(e) : "addEventListener" in n && n.addEventListener("DOMContentLoaded", function() {
                o._init(e)
            })
        }
    };
    return e(n).on("enhance.tablesaw", function() {
            "undefined" != typeof TablesawConfig && TablesawConfig.i18n && (o.i18n = e.extend(o.i18n, TablesawConfig.i18n || {})), o.i18n.modes = [o.i18n.modeStack, o.i18n.modeSwipe, o.i18n.modeToggle]
        }), o.mustard && e(n.documentElement).addClass("tablesaw-enhanced"),
        function() {
            var i = {
                    toolbar: "tablesaw-bar"
                },
                r = {
                    create: "tablesawcreate",
                    destroy: "tablesawdestroy",
                    refresh: "tablesawrefresh",
                    resize: "tablesawresize"
                },
                s = {};
            o.events = r;
            var a = function(t) {
                if (!t) throw new Error("Tablesaw requires an element.");
                this.table = t, this.$table = e(t), this.$thead = this.$table.children().filter("thead").eq(0), this.$tbody = this.$table.children().filter("tbody"), this.mode = this.$table.attr("data-tablesaw-mode") || "stack", this.$toolbar = null, this.attributes = {
                    subrow: "data-tablesaw-subrow",
                    ignorerow: "data-tablesaw-ignorerow"
                }, this.init()
            };
            a.prototype.init = function() {
                if (!this.$thead.length) throw new Error("tablesaw: a <thead> is required, but none was found.");
                if (!this.$thead.find("th").length) throw new Error("tablesaw: no header cells found. Are you using <th> inside of <thead>?");
                this.$table.attr("id") || this.$table.attr("id", "tablesaw-" + Math.round(1e4 * Math.random())), this.createToolbar(), this._initCells(), this.$table.data("tablesaw", this), this.$table.trigger(r.create, [this])
            }, a.prototype.getConfig = function(t) {
                var n = e.extend(s, t || {});
                return e.extend(n, "undefined" != typeof TablesawConfig ? TablesawConfig : {})
            }, a.prototype._getPrimaryHeaderRow = function() {
                return this._getHeaderRows().eq(0)
            }, a.prototype._getHeaderRows = function() {
                return this.$thead.children().filter("tr").filter(function() {
                    return !e(this).is("[data-tablesaw-ignorerow]")
                })
            }, a.prototype._getRowIndex = function(e) {
                return e.prevAll().length
            }, a.prototype._getHeaderRowIndeces = function() {
                var t = this,
                    n = [];
                return this._getHeaderRows().each(function() {
                    n.push(t._getRowIndex(e(this)))
                }), n
            }, a.prototype._getPrimaryHeaderCells = function(e) {
                return (e || this._getPrimaryHeaderRow()).find("th")
            }, a.prototype._$getCells = function(t) {
                var n = this;
                return e(t).add(t.cells).filter(function() {
                    var t = e(this),
                        i = t.parent(),
                        o = t.is("[colspan]");
                    return !(i.is("[" + n.attributes.subrow + "]") || i.is("[" + n.attributes.ignorerow + "]") && o)
                })
            }, a.prototype._getVisibleColspan = function() {
                var t = 0;
                return this._getPrimaryHeaderCells().each(function() {
                    var n = e(this);
                    "none" !== n.css("display") && (t += parseInt(n.attr("colspan"), 10) || 1)
                }), t
            }, a.prototype.getColspanForCell = function(t) {
                var n = this._getVisibleColspan(),
                    i = 0;
                return t.closest("tr").data("tablesaw-rowspanned") && i++, t.siblings().each(function() {
                    var t = e(this),
                        n = parseInt(t.attr("colspan"), 10) || 1;
                    "none" !== t.css("display") && (i += n)
                }), n - i
            }, a.prototype.isCellInColumn = function(t, n) {
                return e(t).add(t.cells).filter(function() {
                    return this === n
                }).length
            }, a.prototype.updateColspanCells = function(t, n, i) {
                var o = this,
                    r = o._getPrimaryHeaderRow();
                this.$table.find("[rowspan][data-tablesaw-priority]").each(function() {
                    var t = e(this);
                    if ("persist" === t.attr("data-tablesaw-priority")) {
                        var n = t.closest("tr"),
                            i = parseInt(t.attr("rowspan"), 10);
                        i > 1 && (n = n.next(), n.data("tablesaw-rowspanned", !0), i--)
                    }
                }), this.$table.find("[colspan],[data-tablesaw-maxcolspan]").filter(function() {
                    return e(this).closest("tr")[0] !== r[0]
                }).each(function() {
                    var r = e(this);
                    if (void 0 === i || o.isCellInColumn(n, this)) {
                        var s = o.getColspanForCell(r);
                        t && void 0 !== i && r[0 === s ? "addClass" : "removeClass"](t);
                        var a = parseInt(r.attr("data-tablesaw-maxcolspan"), 10);
                        a ? s > a && (s = a) : r.attr("data-tablesaw-maxcolspan", r.attr("colspan")), r.attr("colspan", s)
                    }
                })
            }, a.prototype._findPrimaryHeadersForCell = function(e) {
                for (var t = this._getPrimaryHeaderRow(), n = this._getPrimaryHeaderCells(t), i = this._getRowIndex(t), o = [], r = 0; r < this.headerMapping.length; r++)
                    if (r !== i)
                        for (var s = 0; s < this.headerMapping[r].length; s++) this.headerMapping[r][s] === e && o.push(n[s]);
                return o
            }, a.prototype.getRows = function() {
                var t = this;
                return this.$table.find("tr").filter(function() {
                    return e(this).closest("table").is(t.$table)
                })
            }, a.prototype.getBodyRows = function(t) {
                return (t ? e(t) : this.$tbody).children().filter("tr")
            }, a.prototype.getHeaderCellIndex = function(e) {
                for (var t = this.headerMapping[0], n = 0; n < t.length; n++)
                    if (t[n] === e) return n;
                return -1
            }, a.prototype._initCells = function() {
                this.$table.find("[data-tablesaw-maxcolspan]").each(function() {
                    var t = e(this);
                    t.attr("colspan", t.attr("data-tablesaw-maxcolspan"))
                });
                var t = this.getRows(),
                    n = [];
                t.each(function(e) {
                    n[e] = []
                }), t.each(function(t) {
                    var i = 0;
                    e(this).children().each(function() {
                        for (var e = parseInt(this.getAttribute("data-tablesaw-maxcolspan") || this.getAttribute("colspan"), 10), o = parseInt(this.getAttribute("rowspan"), 10); n[t][i];) i++;
                        if (n[t][i] = this, e)
                            for (var r = 0; r < e - 1; r++) i++, n[t][i] = this;
                        if (o)
                            for (var s = 1; s < o; s++) n[t + s][i] = this;
                        i++
                    })
                });
                for (var i = this._getHeaderRowIndeces(), o = 0; o < n[0].length; o++)
                    for (var r = 0, s = i.length; r < s; r++) {
                        var a, l = n[i[r]][o],
                            c = i[r];
                        for (l.cells || (l.cells = []); c < n.length;) a = n[c][o], l !== a && l.cells.push(a), c++
                    }
                this.headerMapping = n
            }, a.prototype.refresh = function() {
                this._initCells(), this.$table.trigger(r.refresh, [this])
            }, a.prototype._getToolbarAnchor = function() {
                var e = this.$table.parent();
                return e.is(".tablesaw-overflow") ? e : this.$table
            }, a.prototype._getToolbar = function(e) {
                return e || (e = this._getToolbarAnchor()), e.prev().filter("." + i.toolbar)
            }, a.prototype.createToolbar = function() {
                var t = this._getToolbarAnchor(),
                    n = this._getToolbar(t);
                n.length || (n = e("<div>").addClass(i.toolbar).insertBefore(t)), this.$toolbar = n, this.mode && this.$toolbar.addClass("tablesaw-mode-" + this.mode)
            }, a.prototype.destroy = function() {
                this._getToolbar().each(function() {
                    this.className = this.className.replace(/\btablesaw-mode\-\w*\b/gi, "")
                });
                var i = this.$table.attr("id");
                e(n).off("." + i), e(t).off("." + i), this.$table.trigger(r.destroy, [this]), this.$table.removeData("tablesaw")
            }, e.fn.tablesaw = function() {
                return this.each(function() {
                    e(this).data("tablesaw") || new a(this)
                })
            };
            var l = e(n);
            l.on("enhance.tablesaw", function(t) {
                o.mustard && e(t.target).find("table").filter("[data-tablesaw],[data-tablesaw-mode],[data-tablesaw-sortable]").tablesaw()
            });
            var c, d = !1;
            l.on("scroll.tablesaw", function() {
                d = !0, t.clearTimeout(c), c = t.setTimeout(function() {
                    d = !1
                }, 300)
            });
            var u;
            e(t).on("resize", function() {
                d || (t.clearTimeout(u), u = t.setTimeout(function() {
                    l.trigger(r.resize)
                }, 150))
            }), o.Table = a
        }(),
        function() {
            var t = {
                    stackTable: "tablesaw-stack",
                    cellLabels: "tablesaw-cell-label",
                    cellContentLabels: "tablesaw-cell-content"
                },
                i = {
                    key: "tablesaw-stack"
                },
                r = {
                    labelless: "data-tablesaw-no-labels",
                    hideempty: "data-tablesaw-hide-empty"
                },
                s = function(t, n) {
                    this.tablesaw = n, this.$table = e(t), this.labelless = this.$table.is("[" + r.labelless + "]"), this.hideempty = this.$table.is("[" + r.hideempty + "]"), this.$table.data(i.key, this)
                };
            s.prototype.init = function() {
                if (this.$table.addClass(t.stackTable), !this.labelless) {
                    var i = this;
                    this.$table.find("th, td").filter(function() {
                        return !e(this).closest("thead").length
                    }).filter(function() {
                        return !(e(this).closest("tr").is("[" + r.labelless + "]") || i.hideempty && !e(this).html())
                    }).each(function() {
                        var o = e(n.createElement("b")).addClass(t.cellLabels),
                            r = e(this);
                        e(i.tablesaw._findPrimaryHeadersForCell(this)).each(function(t) {
                            var i = e(this.cloneNode(!0)),
                                r = i.find(".tablesaw-sortable-btn");
                            i.find(".tablesaw-sortable-arrow").remove();
                            var s = i.find("[data-tablesaw-checkall]");
                            if (s.closest("label").remove(), s.length) return void(o = e([]));
                            t > 0 && o.append(n.createTextNode(", "));
                            for (var a, l = r.length ? r[0] : i[0]; a = l.firstChild;) o[0].appendChild(a)
                        }), o.length && !r.find("." + t.cellContentLabels).length && r.wrapInner("<span class='" + t.cellContentLabels + "'></span>");
                        var s = r.find("." + t.cellLabels);
                        s.length ? s.replaceWith(o) : r.prepend(o)
                    })
                }
            }, s.prototype.destroy = function() {
                this.$table.removeClass(t.stackTable), this.$table.find("." + t.cellLabels).remove(), this.$table.find("." + t.cellContentLabels).each(function() {
                    e(this).replaceWith(this.childNodes)
                })
            }, e(n).on(o.events.create, function(e, t) {
                if ("stack" === t.mode) {
                    new s(t.table, t).init()
                }
            }).on(o.events.refresh, function(t, n) {
                "stack" === n.mode && e(n.table).data(i.key).init()
            }).on(o.events.destroy, function(t, n) {
                "stack" === n.mode && e(n.table).data(i.key).destroy()
            }), o.Stack = s
        }(),
        function() {
            var t = "tablesawbtn",
                i = {
                    _create: function() {
                        return e(this).each(function() {
                            e(this).trigger("beforecreate.tablesawbtn")[t]("_init").trigger("create.tablesawbtn")
                        })
                    },
                    _init: function() {
                        var n = e(this),
                            i = this.getElementsByTagName("select")[0];
                        return i && e(this).addClass("btn-select tablesaw-btn-select")[t]("_select", i), n
                    },
                    _select: function(t) {
                        var i = function(t, i) {
                            var o, r, s = e(i).find("option"),
                                a = n.createElement("span"),
                                l = !1;
                            if (a.setAttribute("aria-hidden", "true"), a.innerHTML = "&#160;", s.each(function() {
                                    var e = this;
                                    e.selected && (a.innerHTML = e.text)
                                }), r = t.childNodes, s.length > 0) {
                                for (var c = 0, d = r.length; c < d; c++)(o = r[c]) && "SPAN" === o.nodeName.toUpperCase() && (t.replaceChild(a, o), l = !0);
                                l || t.insertBefore(a, t.firstChild)
                            }
                        };
                        i(this, t), e(this).on("change refresh", function() {
                            i(this, t)
                        })
                    }
                };
            e.fn[t] = function(n, i, o, r) {
                return this.each(function() {
                    return n && "string" == typeof n ? e.fn[t].prototype[n].call(this, i, o, r) : e(this).data("tablesawbtnactive") ? e(this) : (e(this).data("tablesawbtnactive", !0), void e.fn[t].prototype._create.call(this))
                })
            }, e.extend(e.fn[t].prototype, i)
        }(),
        function() {
            var i = {
                    key: "tablesaw-coltoggle"
                },
                r = function(t) {
                    this.$table = e(t), this.$table.length && (this.tablesaw = this.$table.data("tablesaw"), this.attributes = {
                        btnTarget: "data-tablesaw-columntoggle-btn-target",
                        set: "data-tablesaw-columntoggle-set"
                    }, this.classes = {
                        columnToggleTable: "tablesaw-columntoggle",
                        columnBtnContain: "tablesaw-columntoggle-btnwrap tablesaw-advance",
                        columnBtn: "tablesaw-columntoggle-btn tablesaw-nav-btn down",
                        popup: "tablesaw-columntoggle-popup",
                        priorityPrefix: "tablesaw-priority-"
                    }, this.set = [], this.$headers = this.tablesaw._getPrimaryHeaderCells(), this.$table.data(i.key, this))
                };
            r.prototype.initSet = function() {
                var t = this.$table.attr(this.attributes.set);
                if (t) {
                    var n = this.$table[0];
                    this.set = e("table[" + this.attributes.set + "='" + t + "']").filter(function() {
                        return this !== n
                    }).get()
                }
            }, r.prototype.init = function() {
                function r(e) {
                    var t = e.checked,
                        n = h.getHeaderFromCheckbox(e),
                        i = h.tablesaw._$getCells(n);
                    i[t ? "removeClass" : "addClass"]("tablesaw-toggle-cellhidden"), i[t ? "addClass" : "removeClass"]("tablesaw-toggle-cellvisible"), h.updateColspanCells(n, t), h.$table.trigger("tablesawcolumns")
                }

                function s(t) {
                    t && e(t.target).closest("." + h.classes.popup).length || (e(n).off("click." + l), d.removeClass("up").addClass("down"), f.removeClass("visible"))
                }

                function a() {
                    f.addClass("visible"), d.removeClass("down").addClass("up"), e(n).off("click." + l, s), t.clearTimeout(y), y = t.setTimeout(function() {
                        e(n).on("click." + l, s)
                    }, 15)
                }
                if (this.$table.length) {
                    var l, c, d, u, p, f, h = this,
                        v = this.tablesaw.getConfig({
                            getColumnToggleLabelTemplate: function(e) {
                                return "<label><input type='checkbox' checked>" + e + "</label>"
                            }
                        });
                    this.$table.addClass(this.classes.columnToggleTable), l = this.$table.attr("id"), c = l + "-popup", f = e("<div class='" + this.classes.columnBtnContain + "'></div>"), d = e("<a href='#" + c + "' class='btn tablesaw-btn btn-micro " + this.classes.columnBtn + "' data-popup-link><span>" + o.i18n.columnToggleButton + "</span></a>"), u = e("<div class='" + this.classes.popup + "' id='" + c + "'></div>"), p = e("<div class='btn-group'></div>"), this.$popup = u;
                    var m = !1;
                    this.$headers.each(function() {
                        var t = e(this),
                            n = t.attr("data-tablesaw-priority"),
                            i = h.tablesaw._$getCells(this);
                        n && "persist" !== n && (i.addClass(h.classes.priorityPrefix + n), e(v.getColumnToggleLabelTemplate(t.text())).appendTo(p).find('input[type="checkbox"]').data("tablesaw-header", this), m = !0)
                    }), m || p.append("<label>" + o.i18n.columnToggleError + "</label>"), p.appendTo(u), p.find('input[type="checkbox"]').on("change", function(t) {
                        if (r(t.target), h.set.length) {
                            var n;
                            e(h.$popup).find("input[type='checkbox']").each(function(e) {
                                if (this === t.target) return n = e, !1
                            }), e(h.set).each(function() {
                                var o = e(this).data(i.key).$popup.find("input[type='checkbox']").get(n);
                                o && (o.checked = t.target.checked, r(o))
                            })
                        }
                    }), d.appendTo(f);
                    var g = e(this.$table.attr(this.attributes.btnTarget));
                    f.appendTo(g.length ? g : this.tablesaw.$toolbar);
                    var y;
                    d.on("click.tablesaw", function(e) {
                        e.preventDefault(), f.is(".visible") ? s() : a()
                    }), u.appendTo(f), this.$menu = p;
                    var b = this.$table.closest(".tablesaw-overflow");
                    if (b.css("-webkit-overflow-scrolling")) {
                        var w;
                        b.on("scroll", function() {
                            var n = e(this);
                            t.clearTimeout(w), w = t.setTimeout(function() {
                                n.css("-webkit-overflow-scrolling", "auto"), t.setTimeout(function() {
                                    n.css("-webkit-overflow-scrolling", "touch")
                                }, 0)
                            }, 100)
                        })
                    }
                    e(t).on(o.events.resize + "." + l, function() {
                        h.refreshToggle()
                    }), this.initSet(), this.refreshToggle()
                }
            }, r.prototype.getHeaderFromCheckbox = function(t) {
                return e(t).data("tablesaw-header")
            }, r.prototype.refreshToggle = function() {
                var e = this;
                this.$menu.find("input").each(function() {
                    var t = e.getHeaderFromCheckbox(this);
                    this.checked = "table-cell" === e.tablesaw._$getCells(t).eq(0).css("display")
                }), this.updateColspanCells()
            }, r.prototype.updateColspanCells = function(e, t) {
                this.tablesaw.updateColspanCells("tablesaw-toggle-cellhidden", e, t)
            }, r.prototype.destroy = function() {
                this.$table.removeClass(this.classes.columnToggleTable), this.$table.find("th, td").each(function() {
                    e(this).removeClass("tablesaw-toggle-cellhidden").removeClass("tablesaw-toggle-cellvisible"), this.className = this.className.replace(/\bui\-table\-priority\-\d\b/g, "")
                })
            }, e(n).on(o.events.create, function(e, t) {
                if ("columntoggle" === t.mode) {
                    new r(t.table).init()
                }
            }), e(n).on(o.events.destroy, function(t, n) {
                "columntoggle" === n.mode && e(n.table).data(i.key).destroy()
            }), e(n).on(o.events.refresh, function(t, n) {
                "columntoggle" === n.mode && e(n.table).data(i.key).refreshPriority()
            }), o.ColumnToggle = r
        }(),
        function() {
            function t(t) {
                var n = [];
                return e(t.childNodes).each(function() {
                    var t = e(this);
                    t.is("input, select") ? n.push(t.val()) : t.is(".tablesaw-cell-label") || n.push((t.text() || "").replace(/^\s+|\s+$/g, ""))
                }), n.join("")
            }
            var i = "tablesaw-sortable",
                r = "table[data-" + i + "]",
                s = "[data-" + i + "-switch]",
                a = {
                    sortCol: "data-tablesaw-sortable-col",
                    defaultCol: "data-tablesaw-sortable-default-col",
                    numericCol: "data-tablesaw-sortable-numeric",
                    subRow: "data-tablesaw-subrow",
                    ignoreRow: "data-tablesaw-ignorerow"
                },
                l = {
                    head: i + "-head",
                    ascend: i + "-ascending",
                    descend: i + "-descending",
                    switcher: i + "-switch",
                    tableToolbar: "tablesaw-bar-section",
                    sortButton: i + "-btn"
                },
                c = {
                    _create: function(t) {
                        return e(this).each(function() {
                            if (e(this).data(i + "-init")) return !1;
                            e(this).data(i + "-init", !0).trigger("beforecreate." + i)[i]("_init", t).trigger("create." + i)
                        })
                    },
                    _init: function() {
                        function n(t) {
                            e.each(t, function(t, n) {
                                var i = e(n);
                                i.removeAttr(a.defaultCol), i.removeClass(l.ascend), i.removeClass(l.descend)
                            })
                        }

                        function r(t) {
                            if (!e(t.target).is("a[href]")) {
                                t.stopPropagation();
                                var o = e(t.target).closest("[" + a.sortCol + "]"),
                                    r = t.data.col,
                                    s = c.index(o[0]);
                                n(o.closest("thead").find("th").filter(function() {
                                    return this !== o[0]
                                })), o.is("." + l.descend) || !o.is("." + l.ascend) ? (u[i]("sortBy", r, !0), s += "_asc") : (u[i]("sortBy", r), s += "_desc"), d && d.find("select").val(s).trigger("refresh"), t.preventDefault()
                            }
                        }
                        var c, d, u = e(this),
                            p = u.data("tablesaw");
                        u.addClass(i), c = u.children().filter("thead").find("th[" + a.sortCol + "]"),
                            function(t) {
                                e.each(t, function(t, n) {
                                    e(n).addClass(l.head)
                                })
                            }(c),
                            function(t, n) {
                                e.each(t, function(t, i) {
                                    var o = e("<button class='" + l.sortButton + "'/>");
                                    o.on("click", {
                                        col: i
                                    }, n), e(i).wrapInner(o).find("button").append("<span class='tablesaw-sortable-arrow'>")
                                })
                            }(c, r),
                            function(t) {
                                e.each(t, function(t, n) {
                                    var i = e(n);
                                    i.is("[" + a.defaultCol + "]") && (i.is("." + l.descend) || i.addClass(l.ascend))
                                })
                            }(c), u.is(s) && function(r) {
                                d = e("<div>").addClass(l.switcher).addClass(l.tableToolbar);
                                var s = ["<label>" + o.i18n.sort + ":"];
                                s.push('<span class="btn tablesaw-btn"><select>'), r.each(function(n) {
                                    var i = e(this),
                                        o = i.is("[" + a.defaultCol + "]"),
                                        r = i.is("." + l.descend),
                                        c = i.is("[" + a.numericCol + "]"),
                                        d = 0;
                                    e(this.cells.slice(0, 5)).each(function() {
                                        isNaN(parseInt(t(this), 10)) || d++
                                    });
                                    var u = 5 === d;
                                    c || i.attr(a.numericCol, u ? "" : "false"), s.push("<option" + (o && !r ? " selected" : "") + ' value="' + n + '_asc">' + i.text() + " " + (u ? "&#x2191;" : "(A-Z)") + "</option>"), s.push("<option" + (o && r ? " selected" : "") + ' value="' + n + '_desc">' + i.text() + " " + (u ? "&#x2193;" : "(Z-A)") + "</option>")
                                }), s.push("</select></span></label>"), d.html(s.join(""));
                                var c = p.$toolbar.children().eq(0);
                                c.length ? d.insertBefore(c) : d.appendTo(p.$toolbar), d.find(".tablesaw-btn").tablesawbtn(), d.find("select").on("change", function() {
                                    var t = e(this).val().split("_"),
                                        o = r.eq(t[0]);
                                    n(o.siblings()), u[i]("sortBy", o.get(0), "asc" === t[1])
                                })
                            }(c)
                    },
                    sortRows: function(n, i, o, r, s) {
                        var l, c, d = function(n, i) {
                                var o = [];
                                return e.each(n, function(n, r) {
                                    for (var s = r.parentNode, l = e(s), c = [], d = l.next(); d.is("[" + a.subRow + "]");) c.push(d[0]), d = d.next();
                                    var u = s.parentNode;
                                    l.is("[" + a.subRow + "]") || u === i && o.push({
                                        element: r,
                                        cell: t(r),
                                        row: s,
                                        subrows: c.length ? c : null,
                                        ignored: l.is("[" + a.ignoreRow + "]")
                                    })
                                }), o
                            }(r.cells, s),
                            u = e(r).data("tablesaw-sort");
                        return l = !(!u || "function" != typeof u) && u(o) || function(e, t) {
                                var n = /[^\-\+\d\.]/g;
                                return e ? function(e, i) {
                                    return e.ignored || i.ignored ? 0 : t ? parseFloat(e.cell.replace(n, "")) - parseFloat(i.cell.replace(n, "")) : e.cell.toLowerCase() > i.cell.toLowerCase() ? 1 : -1
                                } : function(e, i) {
                                    return e.ignored || i.ignored ? 0 : t ? parseFloat(i.cell.replace(n, "")) - parseFloat(e.cell.replace(n, "")) : e.cell.toLowerCase() < i.cell.toLowerCase() ? 1 : -1
                                }
                            }(o, e(r).is("[" + a.numericCol + "]") && !e(r).is("[" + a.numericCol + '="false"]')), c = d.sort(l),
                            function(e) {
                                var t, n, i = [];
                                for (t = 0, n = e.length; t < n; t++) i.push(e[t].row), e[t].subrows && i.push(e[t].subrows);
                                return i
                            }(c)
                    },
                    makeColDefault: function(t, n) {
                        var i = e(t);
                        i.attr(a.defaultCol, "true"), n ? (i.removeClass(l.descend), i.addClass(l.ascend)) : (i.removeClass(l.ascend), i.addClass(l.descend))
                    },
                    sortBy: function(t, n) {
                        var o, r = e(this),
                            s = r.data("tablesaw");
                        s.$tbody.each(function() {
                            var a, l, c, d = this,
                                u = e(this),
                                p = s.getBodyRows(d),
                                f = s.headerMapping[0];
                            for (l = 0, c = f.length; l < c; l++)
                                if (f[l] === t) {
                                    o = l;
                                    break
                                }
                            for (a = r[i]("sortRows", p, o, n, t, d), l = 0, c = a.length; l < c; l++) u.append(a[l])
                        }), r[i]("makeColDefault", t, n), r.trigger("tablesaw-sorted")
                    }
                };
            e.fn[i] = function(t) {
                var n, o = Array.prototype.slice.call(arguments, 1);
                return t && "string" == typeof t ? (n = e.fn[i].prototype[t].apply(this[0], o), void 0 !== n ? n : e(this)) : (e(this).data(i + "-active") || (e(this).data(i + "-active", !0), e.fn[i].prototype._create.call(this, t)), e(this))
            }, e.extend(e.fn[i].prototype, c), e(n).on(o.events.create, function(e, t) {
                t.$table.is(r) && t.$table[i]()
            })
        }(),
        function() {
            function i(i, a) {
                function l() {
                    a.css({
                        width: "1px"
                    }), a.find("." + r.hiddenCol).removeClass(r.hiddenCol), D = [], T.each(function() {
                        D.push(this.offsetWidth)
                    }), a.css({
                        width: ""
                    })
                }

                function c(e) {
                    $._$getCells(e).removeClass(r.hiddenCol)
                }

                function d(e) {
                    $._$getCells(e).addClass(r.hiddenCol)
                }

                function u(e) {
                    $._$getCells(e).addClass(r.persistCol)
                }

                function p(t) {
                    return e(t).is('[data-tablesaw-priority="persist"]')
                }

                function f() {
                    a.removeClass(r.persistWidths), e("#" + j + "-persist").remove()
                }

                function h() {
                    var t, n = "#" + j + ".tablesaw-swipe ",
                        i = [],
                        o = a.width(),
                        s = [];
                    if (T.each(function(e) {
                            var t;
                            p(this) && (t = this.offsetWidth) < .75 * o && (s.push(e + "-" + t), i.push(n + " ." + r.persistCol + ":nth-child(" + (e + 1) + ") { width: " + t + "px; }"))
                        }), t = s.join("_"), i.length) {
                        a.addClass(r.persistWidths);
                        var l = e("#" + j + "-persist");
                        l.length && l.data("tablesaw-hash") === t || (l.remove(), e("<style>" + i.join("\n") + "</style>").attr("id", j + "-persist").data("tablesaw-hash", t).appendTo(E))
                    }
                }

                function v() {
                    var t, n = [];
                    return A.each(function(i) {
                        var o = e(this),
                            s = "none" === o.css("display") || o.is("." + r.hiddenCol);
                        if (s || t) {
                            if (s && t) return n[1] = i, !1
                        } else t = !0, n[0] = i
                    }), n
                }

                function m() {
                    var e = v();
                    return [e[1] - 1, e[0] - 1]
                }

                function g(e) {
                    return e ? v() : m()
                }

                function y(e) {
                    return e[1] > -1 && e[1] < A.length
                }

                function b() {
                    var e = a.attr("data-tablesaw-swipe-media");
                    return !e || "matchMedia" in t && t.matchMedia(e).matches
                }

                function w() {
                    if (b()) {
                        var t = a.parent().width(),
                            n = [],
                            i = 0,
                            o = [],
                            s = T.length;
                        T.each(function(r) {
                            var a = e(this),
                                l = a.is('[data-tablesaw-priority="persist"]');
                            n.push(l), i += D[r], o.push(i), (l || i > t) && s--
                        });
                        var l = 0 === s;
                        T.each(function(e) {
                            o[e] > t && d(this)
                        }), T.each(function(e) {
                            if (n[e]) return void u(this);
                            (o[e] <= t || l) && (l = !1, c(this), $.updateColspanCells(r.hiddenCol, this, !0))
                        }), f(), a.trigger("tablesawcolumns")
                    }
                }

                function x(e) {
                    var t = g(e);
                    y(t) && (isNaN(t[0]) && (t[0] = e ? 0 : A.length - 1), h(), d(A.get(t[0])), $.updateColspanCells(r.hiddenCol, A.get(t[0]), !1), c(A.get(t[1])), $.updateColspanCells(r.hiddenCol, A.get(t[1]), !0), a.trigger("tablesawcolumns"))
                }

                function C(e, t) {
                    return (e.touches || e.originalEvent.touches)[0][t]
                }
                var $ = a.data("tablesaw"),
                    k = e("<div class='tablesaw-advance'></div>"),
                    S = e("<a href='#' class='btn tablesaw-nav-btn tablesaw-btn btn-micro left'>" + o.i18n.swipePreviousColumn + "</a>").appendTo(k),
                    _ = e("<a href='#' class='btn tablesaw-nav-btn tablesaw-btn btn-micro right'>" + o.i18n.swipeNextColumn + "</a>").appendTo(k),
                    T = i._getPrimaryHeaderCells(),
                    A = T.not('[data-tablesaw-priority="persist"]'),
                    D = [],
                    E = e(n.head || "head"),
                    j = a.attr("id");
                if (!T.length) throw new Error("tablesaw swipe: no header cells found.");
                a.addClass("tablesaw-swipe"), l(), k.appendTo($.$toolbar), j || (j = "tableswipe-" + Math.round(1e4 * Math.random()), a.attr("id", j)), S.add(_).on("click", function(t) {
                    x(!!e(t.target).closest(_).length), t.preventDefault()
                }), a.is("[" + s.disableTouchEvents + "]") || a.on("touchstart.swipetoggle", function(n) {
                    var r, s, a = C(n, "pageX"),
                        l = C(n, "pageY"),
                        c = t.pageYOffset;
                    e(t).off(o.events.resize, w), e(this).on("touchmove.swipetoggle", function(e) {
                        r = C(e, "pageX"), s = C(e, "pageY")
                    }).on("touchend.swipetoggle", function() {
                        var n = i.getConfig({
                                swipeHorizontalThreshold: 30,
                                swipeVerticalThreshold: 30
                            }),
                            d = n.swipe ? n.swipe.verticalThreshold : n.swipeVerticalThreshold,
                            u = n.swipe ? n.swipe.horizontalThreshold : n.swipeHorizontalThreshold,
                            p = Math.abs(t.pageYOffset - c) >= d;
                        Math.abs(s - l) >= d || p || (r - a < -1 * u && x(!0), r - a > u && x(!1)), t.setTimeout(function() {
                            e(t).on(o.events.resize, w)
                        }, 300), e(this).off("touchmove.swipetoggle touchend.swipetoggle")
                    })
                }), a.on("tablesawcolumns.swipetoggle", function() {
                    var e = y(m()),
                        t = y(v());
                    S[e ? "removeClass" : "addClass"](r.hideBtn), _[t ? "removeClass" : "addClass"](r.hideBtn), $.$toolbar[e || t ? "removeClass" : "addClass"](r.allColumnsVisible)
                }).on("tablesawnext.swipetoggle", function() {
                    x(!0)
                }).on("tablesawprev.swipetoggle", function() {
                    x(!1)
                }).on(o.events.destroy + ".swipetoggle", function() {
                    var n = e(this);
                    n.removeClass("tablesaw-swipe"), $.$toolbar.find(".tablesaw-advance").remove(), e(t).off(o.events.resize, w), n.off(".swipetoggle")
                }).on(o.events.refresh, function() {
                    f(), l(), w()
                }), w(), e(t).on(o.events.resize, w)
            }
            var r = {
                    hideBtn: "disabled",
                    persistWidths: "tablesaw-fix-persist",
                    hiddenCol: "tablesaw-swipe-cellhidden",
                    persistCol: "tablesaw-swipe-cellpersist",
                    allColumnsVisible: "tablesaw-all-cols-visible"
                },
                s = {
                    disableTouchEvents: "data-tablesaw-no-touch",
                    ignorerow: "data-tablesaw-ignorerow",
                    subrow: "data-tablesaw-subrow"
                };
            e(n).on(o.events.create, function(e, t) {
                "swipe" === t.mode && i(t, t.$table)
            })
        }(),
        function() {
            function i(n) {
                function i() {
                    if (!r.show(n[0])) return void a.css("display", "none");
                    a.css("display", "block");
                    var t = l.find("li").removeClass(c);
                    n.find("thead th").each(function(n) {
                        "none" === e(this).css("display") && t.eq(n).addClass(c)
                    })
                }
                var s = n.data("tablesaw"),
                    a = e('<div class="tablesaw-advance minimap">'),
                    l = e('<ul class="tablesaw-advance-dots">').appendTo(a),
                    c = "tablesaw-advance-dots-hide";
                n.data("tablesaw")._getPrimaryHeaderCells().each(function() {
                    l.append("<li><i></i></li>")
                }), a.appendTo(s.$toolbar), i(), e(t).on(o.events.resize, i), n.on("tablesawcolumns.minimap", function() {
                    i()
                }).on(o.events.destroy + ".minimap", function() {
                    var n = e(this);
                    s.$toolbar.find(".tablesaw-advance").remove(), e(t).off(o.events.resize, i), n.off(".minimap")
                })
            }
            var r = {
                attr: {
                    init: "data-tablesaw-minimap"
                },
                show: function(e) {
                    var n = e.getAttribute(r.attr.init);
                    return "" === n || !!(n && "matchMedia" in t) && t.matchMedia(n).matches
                }
            };
            e(n).on(o.events.create, function(e, t) {
                "swipe" !== t.mode && "columntoggle" !== t.mode || !t.$table.is("[ " + r.attr.init + "]") || i(t.$table)
            }), o.MiniMap = r
        }(),
        function() {
            var t = {
                selectors: {
                    init: "table[data-tablesaw-mode-switch]"
                },
                attributes: {
                    excludeMode: "data-tablesaw-mode-exclude"
                },
                classes: {
                    main: "tablesaw-modeswitch",
                    toolbar: "tablesaw-bar-section"
                },
                modes: ["stack", "swipe", "columntoggle"],
                init: function(n) {
                    var i, r = e(n),
                        s = r.data("tablesaw"),
                        a = r.attr(t.attributes.excludeMode),
                        l = s.$toolbar,
                        c = e("<div>").addClass(t.classes.main + " " + t.classes.toolbar),
                        d = ['<label><span class="abbreviated">' + o.i18n.modeSwitchColumnsAbbreviated + '</span><span class="longform">' + o.i18n.modeSwitchColumns + "</span>:"],
                        u = r.attr("data-tablesaw-mode");
                    d.push('<span class="btn tablesaw-btn"><select>');
                    for (var p = 0, f = t.modes.length; p < f; p++) a && a.toLowerCase() === t.modes[p] || (i = u === t.modes[p], d.push("<option" + (i ? " selected" : "") + ' value="' + t.modes[p] + '">' + o.i18n.modes[p] + "</option>"));
                    d.push("</select></span></label>"), c.html(d.join(""));
                    var h = l.find(".tablesaw-advance").eq(0);
                    h.length ? c.insertBefore(h) : c.appendTo(l), c.find(".tablesaw-btn").tablesawbtn(), c.find("select").on("change", function(i) {
                        return t.onModeChange.call(n, i, e(this).val())
                    })
                },
                onModeChange: function(n, i) {
                    var o = e(this),
                        r = o.data("tablesaw");
                    r.$toolbar.find("." + t.classes.main).remove(), r.destroy(), o.attr("data-tablesaw-mode", i), o.tablesaw()
                }
            };
            e(n).on(o.events.create, function(e, n) {
                n.$table.is(t.selectors.init) && t.init(n.table)
            })
        }(),
        function() {
            function t(e) {
                this.tablesaw = e, this.$table = e.$table, this.attr = "data-tablesaw-checkall", this.checkAllSelector = "[" + this.attr + "]", this.forceCheckedSelector = "[" + this.attr + "-checked]", this.forceUncheckedSelector = "[" + this.attr + "-unchecked]", this.checkboxSelector = 'input[type="checkbox"]', this.$triggers = null, this.$checkboxes = null, this.$table.data(i) || (this.$table.data(i, this), this.init())
            }
            var i = "tablesawCheckAll";
            t.prototype._filterCells = function(t) {
                return t.filter(function() {
                    return !e(this).closest("tr").is("[data-tablesaw-subrow],[data-tablesaw-ignorerow]")
                }).find(this.checkboxSelector).not(this.checkAllSelector)
            }, t.prototype.getCheckboxesForButton = function(t) {
                return this._filterCells(e(e(t).attr(this.attr)))
            }, t.prototype.getCheckboxesForCheckbox = function(t) {
                return this._filterCells(e(e(t).closest("th")[0].cells))
            }, t.prototype.init = function() {
                var t = this;
                this.$table.find(this.checkAllSelector).each(function() {
                    e(this).is(t.checkboxSelector) ? t.addCheckboxEvents(this) : t.addButtonEvents(this)
                })
            }, t.prototype.addButtonEvents = function(t) {
                var n = this;
                e(t).on("click", function(t) {
                    t.preventDefault();
                    var o = n.getCheckboxesForButton(this),
                        r = !0;
                    o.each(function() {
                        this.checked || (r = !1)
                    });
                    var s;
                    s = !!e(this).is(n.forceCheckedSelector) || !e(this).is(n.forceUncheckedSelector) && !r, o.each(function() {
                        this.checked = s, e(this).trigger("change." + i)
                    })
                })
            }, t.prototype.addCheckboxEvents = function(t) {
                var n = this;
                e(t).on("change", function() {
                    var e = this.checked;
                    n.getCheckboxesForCheckbox(this).each(function() {
                        this.checked = e
                    })
                });
                var o = n.getCheckboxesForCheckbox(t);
                o.on("change." + i, function() {
                    var e = 0;
                    o.each(function() {
                        this.checked && e++
                    });
                    var n = e === o.length;
                    t.checked = n, t.indeterminate = 0 !== e && !n
                })
            }, e(n).on(o.events.create, function(e, n) {
                new t(n)
            }), o.CheckAll = t
        }(), o
}),
function(e) {
    "use strict";
    if (!("Tablesaw" in e)) throw new Error("Tablesaw library not found.");
    if (!("init" in Tablesaw)) throw new Error("Your tablesaw-init.js is newer than the core Tablesaw version.");
    Tablesaw.init()
}("undefined" != typeof window ? window : this),
function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    "use strict";

    function n(e, t, n) {
        var i, o, r = (n = n || Q).createElement("script");
        if (r.text = e, t)
            for (i in pe)(o = t[i] || t.getAttribute && t.getAttribute(i)) && r.setAttribute(i, o);
        n.head.appendChild(r).parentNode.removeChild(r)
    }

    function i(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? oe[re.call(e)] || "object" : typeof e
    }

    function o(e) {
        var t = !!e && "length" in e && e.length,
            n = i(e);
        return !de(e) && !ue(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }

    function r(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }

    function s(e, t, n) {
        return de(t) ? he.grep(e, function(e, i) {
            return !!t.call(e, i, e) !== n
        }) : t.nodeType ? he.grep(e, function(e) {
            return e === t !== n
        }) : "string" != typeof t ? he.grep(e, function(e) {
            return -1 < ie.call(t, e) !== n
        }) : he.filter(t, e, n)
    }

    function a(e, t) {
        for (;
            (e = e[t]) && 1 !== e.nodeType;);
        return e
    }

    function l(e) {
        return e
    }

    function c(e) {
        throw e
    }

    function d(e, t, n, i) {
        var o;
        try {
            e && de(o = e.promise) ? o.call(e).done(t).fail(n) : e && de(o = e.then) ? o.call(e, t, n) : t.apply(void 0, [e].slice(i))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }

    function u() {
        Q.removeEventListener("DOMContentLoaded", u), e.removeEventListener("load", u), he.ready()
    }

    function p(e, t) {
        return t.toUpperCase()
    }

    function f(e) {
        return e.replace(De, "ms-").replace(Ee, p)
    }

    function h() {
        this.expando = he.expando + h.uid++
    }

    function v(e, t, n) {
        var i, o;
        if (void 0 === n && 1 === e.nodeType)
            if (i = "data-" + t.replace(Pe, "-$&").toLowerCase(), "string" == typeof(n = e.getAttribute(i))) {
                try {
                    n = "true" === (o = n) || "false" !== o && ("null" === o ? null : o === +o + "" ? +o : Le.test(o) ? JSON.parse(o) : o)
                } catch (e) {}
                Me.set(e, t, n)
            } else n = void 0;
        return n
    }

    function m(e, t, n, i) {
        var o, r, s = 20,
            a = i ? function() {
                return i.cur()
            } : function() {
                return he.css(e, t, "")
            },
            l = a(),
            c = n && n[3] || (he.cssNumber[t] ? "" : "px"),
            d = e.nodeType && (he.cssNumber[t] || "px" !== c && +l) && Ie.exec(he.css(e, t));
        if (d && d[3] !== c) {
            for (l /= 2, c = c || d[3], d = +l || 1; s--;) he.style(e, t, d + c), (1 - r) * (1 - (r = a() / l || .5)) <= 0 && (s = 0), d /= r;
            d *= 2, he.style(e, t, d + c), n = n || []
        }
        return n && (d = +d || +l || 0, o = n[1] ? d + (n[1] + 1) * n[2] : +n[2], i && (i.unit = c, i.start = d, i.end = o)), o
    }

    function g(e, t) {
        for (var n, i, o, r, s, a, l, c = [], d = 0, u = e.length; d < u; d++)(i = e[d]).style && (n = i.style.display, t ? ("none" === n && (c[d] = Oe.get(i, "display") || null, c[d] || (i.style.display = "")), "" === i.style.display && Fe(i) && (c[d] = (l = s = r = void 0, s = (o = i).ownerDocument, a = o.nodeName, (l = We[a]) || (r = s.body.appendChild(s.createElement(a)), l = he.css(r, "display"), r.parentNode.removeChild(r), "none" === l && (l = "block"), We[a] = l)))) : "none" !== n && (c[d] = "none", Oe.set(i, "display", n)));
        for (d = 0; d < u; d++) null != c[d] && (e[d].style.display = c[d]);
        return e
    }

    function y(e, t) {
        var n;
        return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [], void 0 === t || t && r(e, t) ? he.merge([e], n) : n
    }

    function b(e, t) {
        for (var n = 0, i = e.length; n < i; n++) Oe.set(e[n], "globalEval", !t || Oe.get(t[n], "globalEval"))
    }

    function w(e, t, n, o, r) {
        for (var s, a, l, c, d, u, p = t.createDocumentFragment(), f = [], h = 0, v = e.length; h < v; h++)
            if ((s = e[h]) || 0 === s)
                if ("object" === i(s)) he.merge(f, s.nodeType ? [s] : s);
                else if (Ge.test(s)) {
            for (a = a || p.appendChild(t.createElement("div")), l = (Ve.exec(s) || ["", ""])[1].toLowerCase(), c = Ye[l] || Ye._default, a.innerHTML = c[1] + he.htmlPrefilter(s) + c[2], u = c[0]; u--;) a = a.lastChild;
            he.merge(f, a.childNodes), (a = p.firstChild).textContent = ""
        } else f.push(t.createTextNode(s));
        for (p.textContent = "", h = 0; s = f[h++];)
            if (o && -1 < he.inArray(s, o)) r && r.push(s);
            else if (d = Re(s), a = y(p.appendChild(s), "script"), d && b(a), n)
            for (u = 0; s = a[u++];) Xe.test(s.type || "") && n.push(s);
        return p
    }

    function x() {
        return !0
    }

    function C() {
        return !1
    }

    function $(e, t) {
        return e === function() {
            try {
                return Q.activeElement
            } catch (e) {}
        }() == ("focus" === t)
    }

    function k(e, t, n, i, o, r) {
        var s, a;
        if ("object" == typeof t) {
            for (a in "string" != typeof n && (i = i || n, n = void 0), t) k(e, a, n, i, t[a], r);
            return e
        }
        if (null == i && null == o ? (o = n, i = n = void 0) : null == o && ("string" == typeof n ? (o = i, i = void 0) : (o = i, i = n, n = void 0)), !1 === o) o = C;
        else if (!o) return e;
        return 1 === r && (s = o, (o = function(e) {
            return he().off(e), s.apply(this, arguments)
        }).guid = s.guid || (s.guid = he.guid++)), e.each(function() {
            he.event.add(this, t, o, i, n)
        })
    }

    function S(e, t, n) {
        n ? (Oe.set(e, t, !1), he.event.add(e, t, {
            namespace: !1,
            handler: function(e) {
                var i, o, r = Oe.get(this, t);
                if (1 & e.isTrigger && this[t]) {
                    if (r.length)(he.event.special[t] || {}).delegateType && e.stopPropagation();
                    else if (r = ee.call(arguments), Oe.set(this, t, r), i = n(this, t), this[t](), r !== (o = Oe.get(this, t)) || i ? Oe.set(this, t, !1) : o = {}, r !== o) return e.stopImmediatePropagation(), e.preventDefault(), o.value
                } else r.length && (Oe.set(this, t, {
                    value: he.event.trigger(he.extend(r[0], he.Event.prototype), r.slice(1), this)
                }), e.stopImmediatePropagation())
            }
        })) : void 0 === Oe.get(e, t) && he.event.add(e, t, x)
    }

    function _(e, t) {
        return r(e, "table") && r(11 !== t.nodeType ? t : t.firstChild, "tr") && he(e).children("tbody")[0] || e
    }

    function T(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
    }

    function A(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
    }

    function D(e, t) {
        var n, i, o, r, s, a, l, c;
        if (1 === t.nodeType) {
            if (Oe.hasData(e) && (r = Oe.access(e), s = Oe.set(t, r), c = r.events))
                for (o in delete s.handle, s.events = {}, c)
                    for (n = 0, i = c[o].length; n < i; n++) he.event.add(t, o, c[o][n]);
            Me.hasData(e) && (a = Me.access(e), l = he.extend({}, a), Me.set(t, l))
        }
    }

    function E(e, t, i, o) {
        t = te.apply([], t);
        var r, s, a, l, c, d, u = 0,
            p = e.length,
            f = p - 1,
            h = t[0],
            v = de(h);
        if (v || 1 < p && "string" == typeof h && !ce.checkClone && it.test(h)) return e.each(function(n) {
            var r = e.eq(n);
            v && (t[0] = h.call(this, n, r.html())), E(r, t, i, o)
        });
        if (p && (s = (r = w(t, e[0].ownerDocument, !1, e, o)).firstChild, 1 === r.childNodes.length && (r = s), s || o)) {
            for (l = (a = he.map(y(r, "script"), T)).length; u < p; u++) c = r, u !== f && (c = he.clone(c, !0, !0), l && he.merge(a, y(c, "script"))), i.call(e[u], c, u);
            if (l)
                for (d = a[a.length - 1].ownerDocument, he.map(a, A), u = 0; u < l; u++) c = a[u], Xe.test(c.type || "") && !Oe.access(c, "globalEval") && he.contains(d, c) && (c.src && "module" !== (c.type || "").toLowerCase() ? he._evalUrl && !c.noModule && he._evalUrl(c.src, {
                    nonce: c.nonce || c.getAttribute("nonce")
                }) : n(c.textContent.replace(ot, ""), c, d))
        }
        return e
    }

    function j(e, t, n) {
        for (var i, o = t ? he.filter(t, e) : e, r = 0; null != (i = o[r]); r++) n || 1 !== i.nodeType || he.cleanData(y(i)), i.parentNode && (n && Re(i) && b(y(i, "script")), i.parentNode.removeChild(i));
        return e
    }

    function O(e, t, n) {
        var i, o, r, s, a = e.style;
        return (n = n || st(e)) && ("" !== (s = n.getPropertyValue(t) || n[t]) || Re(e) || (s = he.style(e, t)), !ce.pixelBoxStyles() && rt.test(s) && at.test(t) && (i = a.width, o = a.minWidth, r = a.maxWidth, a.minWidth = a.maxWidth = a.width = s, s = n.width, a.width = i, a.minWidth = o, a.maxWidth = r)), void 0 !== s ? s + "" : s
    }

    function M(e, t) {
        return {
            get: function() {
                if (!e()) return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }

    function L(e) {
        return he.cssProps[e] || dt[e] || (e in ct ? e : dt[e] = function(e) {
            for (var t = e[0].toUpperCase() + e.slice(1), n = lt.length; n--;)
                if ((e = lt[n] + t) in ct) return e
        }(e) || e)
    }

    function P(e, t, n) {
        var i = Ie.exec(t);
        return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : t
    }

    function N(e, t, n, i, o, r) {
        var s = "width" === t ? 1 : 0,
            a = 0,
            l = 0;
        if (n === (i ? "border" : "content")) return 0;
        for (; s < 4; s += 2) "margin" === n && (l += he.css(e, n + Be[s], !0, o)), i ? ("content" === n && (l -= he.css(e, "padding" + Be[s], !0, o)), "margin" !== n && (l -= he.css(e, "border" + Be[s] + "Width", !0, o))) : (l += he.css(e, "padding" + Be[s], !0, o), "padding" !== n ? l += he.css(e, "border" + Be[s] + "Width", !0, o) : a += he.css(e, "border" + Be[s] + "Width", !0, o));
        return !i && 0 <= r && (l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - r - l - a - .5)) || 0), l
    }

    function I(e, t, n) {
        var i = st(e),
            o = (!ce.boxSizingReliable() || n) && "border-box" === he.css(e, "boxSizing", !1, i),
            r = o,
            s = O(e, t, i),
            a = "offset" + t[0].toUpperCase() + t.slice(1);
        if (rt.test(s)) {
            if (!n) return s;
            s = "auto"
        }
        return (!ce.boxSizingReliable() && o || "auto" === s || !parseFloat(s) && "inline" === he.css(e, "display", !1, i)) && e.getClientRects().length && (o = "border-box" === he.css(e, "boxSizing", !1, i), (r = a in e) && (s = e[a])), (s = parseFloat(s) || 0) + N(e, t, n || (o ? "border" : "content"), r, i, s) + "px"
    }

    function B(e, t, n, i, o) {
        return new B.prototype.init(e, t, n, i, o)
    }

    function H() {
        mt && (!1 === Q.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(H) : e.setTimeout(H, he.fx.interval), he.fx.tick())
    }

    function R() {
        return e.setTimeout(function() {
            vt = void 0
        }), vt = Date.now()
    }

    function q(e, t) {
        var n, i = 0,
            o = {
                height: e
            };
        for (t = t ? 1 : 0; i < 4; i += 2 - t) o["margin" + (n = Be[i])] = o["padding" + n] = e;
        return t && (o.opacity = o.width = e), o
    }

    function F(e, t, n) {
        for (var i, o = (z.tweeners[t] || []).concat(z.tweeners["*"]), r = 0, s = o.length; r < s; r++)
            if (i = o[r].call(n, t, e)) return i
    }

    function z(e, t, n) {
        var i, o, r = 0,
            s = z.prefilters.length,
            a = he.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (o) return !1;
                for (var t = vt || R(), n = Math.max(0, c.startTime + c.duration - t), i = 1 - (n / c.duration || 0), r = 0, s = c.tweens.length; r < s; r++) c.tweens[r].run(i);
                return a.notifyWith(e, [c, i, n]), i < 1 && s ? n : (s || a.notifyWith(e, [c, 1, 0]), a.resolveWith(e, [c]), !1)
            },
            c = a.promise({
                elem: e,
                props: he.extend({}, t),
                opts: he.extend(!0, {
                    specialEasing: {},
                    easing: he.easing._default
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: vt || R(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var i = he.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                    return c.tweens.push(i), i
                },
                stop: function(t) {
                    var n = 0,
                        i = t ? c.tweens.length : 0;
                    if (o) return this;
                    for (o = !0; n < i; n++) c.tweens[n].run(1);
                    return t ? (a.notifyWith(e, [c, 1, 0]), a.resolveWith(e, [c, t])) : a.rejectWith(e, [c, t]), this
                }
            }),
            d = c.props;
        for ((! function(e, t) {
                var n, i, o, r, s;
                for (n in e)
                    if (o = t[i = f(n)], r = e[n], Array.isArray(r) && (o = r[1], r = e[n] = r[0]), n !== i && (e[i] = r, delete e[n]), (s = he.cssHooks[i]) && "expand" in s)
                        for (n in r = s.expand(r), delete e[i], r) n in e || (e[n] = r[n], t[n] = o);
                    else t[i] = o
            }(d, c.opts.specialEasing)); r < s; r++)
            if (i = z.prefilters[r].call(c, e, d, c.opts)) return de(i.stop) && (he._queueHooks(c.elem, c.opts.queue).stop = i.stop.bind(i)), i;
        return he.map(d, F, c), de(c.opts.start) && c.opts.start.call(e, c), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always), he.fx.timer(he.extend(l, {
            elem: e,
            anim: c,
            queue: c.opts.queue
        })), c
    }

    function W(e) {
        return (e.match(Se) || []).join(" ")
    }

    function U(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }

    function V(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(Se) || []
    }

    function X(e, t, n, o) {
        var r;
        if (Array.isArray(t)) he.each(t, function(t, i) {
            n || jt.test(e) ? o(e, i) : X(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, o)
        });
        else if (n || "object" !== i(t)) o(e, t);
        else
            for (r in t) X(e + "[" + r + "]", t[r], n, o)
    }

    function Y(e) {
        return function(t, n) {
            "string" != typeof t && (n = t, t = "*");
            var i, o = 0,
                r = t.toLowerCase().match(Se) || [];
            if (de(n))
                for (; i = r[o++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
        }
    }

    function J(e, t, n, i) {
        function o(a) {
            var l;
            return r[a] = !0, he.each(e[a] || [], function(e, a) {
                var c = a(t, n, i);
                return "string" != typeof c || s || r[c] ? s ? !(l = c) : void 0 : (t.dataTypes.unshift(c), o(c), !1)
            }), l
        }
        var r = {},
            s = e === Ft;
        return o(t.dataTypes[0]) || !r["*"] && o("*")
    }

    function K(e, t) {
        var n, i, o = he.ajaxSettings.flatOptions || {};
        for (n in t) void 0 !== t[n] && ((o[n] ? e : i || (i = {}))[n] = t[n]);
        return i && he.extend(!0, e, i), e
    }
    var G = [],
        Q = e.document,
        Z = Object.getPrototypeOf,
        ee = G.slice,
        te = G.concat,
        ne = G.push,
        ie = G.indexOf,
        oe = {},
        re = oe.toString,
        se = oe.hasOwnProperty,
        ae = se.toString,
        le = ae.call(Object),
        ce = {},
        de = function(e) {
            return "function" == typeof e && "number" != typeof e.nodeType
        },
        ue = function(e) {
            return null != e && e === e.window
        },
        pe = {
            type: !0,
            src: !0,
            nonce: !0,
            noModule: !0
        },
        fe = "3.4.1",
        he = function(e, t) {
            return new he.fn.init(e, t)
        },
        ve = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    he.fn = he.prototype = {
        jquery: fe,
        constructor: he,
        length: 0,
        toArray: function() {
            return ee.call(this)
        },
        get: function(e) {
            return null == e ? ee.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = he.merge(this.constructor(), e);
            return t.prevObject = this, t
        },
        each: function(e) {
            return he.each(this, e)
        },
        map: function(e) {
            return this.pushStack(he.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(ee.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= n && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: ne,
        sort: G.sort,
        splice: G.splice
    }, he.extend = he.fn.extend = function() {
        var e, t, n, i, o, r, s = arguments[0] || {},
            a = 1,
            l = arguments.length,
            c = !1;
        for ("boolean" == typeof s && (c = s, s = arguments[a] || {}, a++), "object" == typeof s || de(s) || (s = {}), a === l && (s = this, a--); a < l; a++)
            if (null != (e = arguments[a]))
                for (t in e) i = e[t], "__proto__" !== t && s !== i && (c && i && (he.isPlainObject(i) || (o = Array.isArray(i))) ? (n = s[t], r = o && !Array.isArray(n) ? [] : o || he.isPlainObject(n) ? n : {}, o = !1, s[t] = he.extend(c, r, i)) : void 0 !== i && (s[t] = i));
        return s
    }, he.extend({
        expando: "jQuery" + (fe + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            var t, n;
            return !(!e || "[object Object]" !== re.call(e) || (t = Z(e)) && ("function" != typeof(n = se.call(t, "constructor") && t.constructor) || ae.call(n) !== le))
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        globalEval: function(e, t) {
            n(e, {
                nonce: t && t.nonce
            })
        },
        each: function(e, t) {
            var n, i = 0;
            if (o(e))
                for (n = e.length; i < n && !1 !== t.call(e[i], i, e[i]); i++);
            else
                for (i in e)
                    if (!1 === t.call(e[i], i, e[i])) break; return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(ve, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (o(Object(e)) ? he.merge(n, "string" == typeof e ? [e] : e) : ne.call(n, e)), n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : ie.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, i = 0, o = e.length; i < n; i++) e[o++] = t[i];
            return e.length = o, e
        },
        grep: function(e, t, n) {
            for (var i = [], o = 0, r = e.length, s = !n; o < r; o++) !t(e[o], o) !== s && i.push(e[o]);
            return i
        },
        map: function(e, t, n) {
            var i, r, s = 0,
                a = [];
            if (o(e))
                for (i = e.length; s < i; s++) null != (r = t(e[s], s, n)) && a.push(r);
            else
                for (s in e) null != (r = t(e[s], s, n)) && a.push(r);
            return te.apply([], a)
        },
        guid: 1,
        support: ce
    }), "function" == typeof Symbol && (he.fn[Symbol.iterator] = G[Symbol.iterator]), he.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        oe["[object " + t + "]"] = t.toLowerCase()
    });
    var me = function(e) {
        function t(e, t, n, i) {
            var o, r, s, a, l, d, p, f = t && t.ownerDocument,
                h = t ? t.nodeType : 9;
            if (n = n || [], "string" != typeof e || !e || 1 !== h && 9 !== h && 11 !== h) return n;
            if (!i && ((t ? t.ownerDocument || t : I) !== D && A(t), t = t || D, j)) {
                if (11 !== h && (l = ve.exec(e)))
                    if (o = l[1]) {
                        if (9 === h) {
                            if (!(s = t.getElementById(o))) return n;
                            if (s.id === o) return n.push(s), n
                        } else if (f && (s = f.getElementById(o)) && P(t, s) && s.id === o) return n.push(s), n
                    } else {
                        if (l[2]) return J.apply(n, t.getElementsByTagName(e)), n;
                        if ((o = l[3]) && y.getElementsByClassName && t.getElementsByClassName) return J.apply(n, t.getElementsByClassName(o)), n
                    }
                if (y.qsa && !z[e + " "] && (!O || !O.test(e)) && (1 !== h || "object" !== t.nodeName.toLowerCase())) {
                    if (p = e, f = t, 1 === h && ae.test(e)) {
                        for ((a = t.getAttribute("id")) ? a = a.replace(be, we) : t.setAttribute("id", a = N), r = (d = C(e)).length; r--;) d[r] = "#" + a + " " + u(d[r]);
                        p = d.join(","), f = me.test(e) && c(t.parentNode) || t
                    }
                    try {
                        return J.apply(n, f.querySelectorAll(p)), n
                    } catch (t) {
                        z(e, !0)
                    } finally {
                        a === N && t.removeAttribute("id")
                    }
                }
            }
            return k(e.replace(oe, "$1"), t, n, i)
        }

        function n() {
            var e = [];
            return function t(n, i) {
                return e.push(n + " ") > b.cacheLength && delete t[e.shift()], t[n + " "] = i
            }
        }

        function i(e) {
            return e[N] = !0, e
        }

        function o(e) {
            var t = D.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function r(e, t) {
            for (var n = e.split("|"), i = n.length; i--;) b.attrHandle[n[i]] = t
        }

        function s(e, t) {
            var n = t && e,
                i = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (i) return i;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function a(e) {
            return function(t) {
                return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && Ce(t) === e : t.disabled === e : "label" in t && t.disabled === e
            }
        }

        function l(e) {
            return i(function(t) {
                return t = +t, i(function(n, i) {
                    for (var o, r = e([], n.length, t), s = r.length; s--;) n[o = r[s]] && (n[o] = !(i[o] = n[o]))
                })
            })
        }

        function c(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }

        function d() {}

        function u(e) {
            for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
            return i
        }

        function p(e, t, n) {
            var i = t.dir,
                o = t.next,
                r = o || i,
                s = n && "parentNode" === r,
                a = H++;
            return t.first ? function(t, n, o) {
                for (; t = t[i];)
                    if (1 === t.nodeType || s) return e(t, n, o);
                return !1
            } : function(t, n, l) {
                var c, d, u, p = [B, a];
                if (l) {
                    for (; t = t[i];)
                        if ((1 === t.nodeType || s) && e(t, n, l)) return !0
                } else
                    for (; t = t[i];)
                        if (1 === t.nodeType || s)
                            if (d = (u = t[N] || (t[N] = {}))[t.uniqueID] || (u[t.uniqueID] = {}), o && o === t.nodeName.toLowerCase()) t = t[i] || t;
                            else {
                                if ((c = d[r]) && c[0] === B && c[1] === a) return p[2] = c[2];
                                if ((d[r] = p)[2] = e(t, n, l)) return !0
                            } return !1
            }
        }

        function f(e) {
            return 1 < e.length ? function(t, n, i) {
                for (var o = e.length; o--;)
                    if (!e[o](t, n, i)) return !1;
                return !0
            } : e[0]
        }

        function h(e, t, n, i, o) {
            for (var r, s = [], a = 0, l = e.length, c = null != t; a < l; a++)(r = e[a]) && (n && !n(r, i, o) || (s.push(r), c && t.push(a)));
            return s
        }

        function v(e, n, o, r, s, a) {
            return r && !r[N] && (r = v(r)), s && !s[N] && (s = v(s, a)), i(function(i, a, l, c) {
                var d, u, p, f = [],
                    v = [],
                    m = a.length,
                    g = i || function(e, n, i) {
                        for (var o = 0, r = n.length; o < r; o++) t(e, n[o], i);
                        return i
                    }(n || "*", l.nodeType ? [l] : l, []),
                    y = !e || !i && n ? g : h(g, f, e, l, c),
                    b = o ? s || (i ? e : m || r) ? [] : a : y;
                if (o && o(y, b, l, c), r)
                    for (d = h(b, v), r(d, [], l, c), u = d.length; u--;)(p = d[u]) && (b[v[u]] = !(y[v[u]] = p));
                if (i) {
                    if (s || e) {
                        if (s) {
                            for (d = [], u = b.length; u--;)(p = b[u]) && d.push(y[u] = p);
                            s(null, b = [], d, c)
                        }
                        for (u = b.length; u--;)(p = b[u]) && -1 < (d = s ? G(i, p) : f[u]) && (i[d] = !(a[d] = p))
                    }
                } else b = h(b === a ? b.splice(m, b.length) : b), s ? s(null, a, b, c) : J.apply(a, b)
            })
        }

        function m(e) {
            for (var t, n, i, o = e.length, r = b.relative[e[0].type], s = r || b.relative[" "], a = r ? 1 : 0, l = p(function(e) {
                    return e === t
                }, s, !0), c = p(function(e) {
                    return -1 < G(t, e)
                }, s, !0), d = [function(e, n, i) {
                    var o = !r && (i || n !== S) || ((t = n).nodeType ? l(e, n, i) : c(e, n, i));
                    return t = null, o
                }]; a < o; a++)
                if (n = b.relative[e[a].type]) d = [p(f(d), n)];
                else {
                    if ((n = b.filter[e[a].type].apply(null, e[a].matches))[N]) {
                        for (i = ++a; i < o && !b.relative[e[i].type]; i++);
                        return v(1 < a && f(d), 1 < a && u(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(oe, "$1"), n, a < i && m(e.slice(a, i)), i < o && m(e = e.slice(i)), i < o && u(e))
                    }
                    d.push(n)
                }
            return f(d)
        }
        var g, y, b, w, x, C, $, k, S, _, T, A, D, E, j, O, M, L, P, N = "sizzle" + 1 * new Date,
            I = e.document,
            B = 0,
            H = 0,
            R = n(),
            q = n(),
            F = n(),
            z = n(),
            W = function(e, t) {
                return e === t && (T = !0), 0
            },
            U = {}.hasOwnProperty,
            V = [],
            X = V.pop,
            Y = V.push,
            J = V.push,
            K = V.slice,
            G = function(e, t) {
                for (var n = 0, i = e.length; n < i; n++)
                    if (e[n] === t) return n;
                return -1
            },
            Q = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            Z = "[\\x20\\t\\r\\n\\f]",
            ee = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
            te = "\\[" + Z + "*(" + ee + ")(?:" + Z + "*([*^$|!~]?=)" + Z + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ee + "))|)" + Z + "*\\]",
            ne = ":(" + ee + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + te + ")*)|.*)\\)|)",
            ie = new RegExp(Z + "+", "g"),
            oe = new RegExp("^" + Z + "+|((?:^|[^\\\\])(?:\\\\.)*)" + Z + "+$", "g"),
            re = new RegExp("^" + Z + "*," + Z + "*"),
            se = new RegExp("^" + Z + "*([>+~]|" + Z + ")" + Z + "*"),
            ae = new RegExp(Z + "|>"),
            le = new RegExp(ne),
            ce = new RegExp("^" + ee + "$"),
            de = {
                ID: new RegExp("^#(" + ee + ")"),
                CLASS: new RegExp("^\\.(" + ee + ")"),
                TAG: new RegExp("^(" + ee + "|[*])"),
                ATTR: new RegExp("^" + te),
                PSEUDO: new RegExp("^" + ne),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + Z + "*(even|odd|(([+-]|)(\\d*)n|)" + Z + "*(?:([+-]|)" + Z + "*(\\d+)|))" + Z + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + Q + ")$", "i"),
                needsContext: new RegExp("^" + Z + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + Z + "*((?:-\\d)?\\d*)" + Z + "*\\)|)(?=[^-]|$)", "i")
            },
            ue = /HTML$/i,
            pe = /^(?:input|select|textarea|button)$/i,
            fe = /^h\d$/i,
            he = /^[^{]+\{\s*\[native \w/,
            ve = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            me = /[+~]/,
            ge = new RegExp("\\\\([\\da-f]{1,6}" + Z + "?|(" + Z + ")|.)", "ig"),
            ye = function(e, t, n) {
                var i = "0x" + t - 65536;
                return i != i || n ? t : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
            },
            be = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            we = function(e, t) {
                return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
            },
            xe = function() {
                A()
            },
            Ce = p(function(e) {
                return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
            }, {
                dir: "parentNode",
                next: "legend"
            });
        try {
            J.apply(V = K.call(I.childNodes), I.childNodes), V[I.childNodes.length].nodeType
        } catch (g) {
            J = {
                apply: V.length ? function(e, t) {
                    Y.apply(e, K.call(t))
                } : function(e, t) {
                    for (var n = e.length, i = 0; e[n++] = t[i++];);
                    e.length = n - 1
                }
            }
        }
        for (g in y = t.support = {}, x = t.isXML = function(e) {
                var t = e.namespaceURI,
                    n = (e.ownerDocument || e).documentElement;
                return !ue.test(t || n && n.nodeName || "HTML")
            }, A = t.setDocument = function(e) {
                var t, n, i = e ? e.ownerDocument || e : I;
                return i !== D && 9 === i.nodeType && i.documentElement && (E = (D = i).documentElement, j = !x(D), I !== D && (n = D.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", xe, !1) : n.attachEvent && n.attachEvent("onunload", xe)), y.attributes = o(function(e) {
                    return e.className = "i", !e.getAttribute("className")
                }), y.getElementsByTagName = o(function(e) {
                    return e.appendChild(D.createComment("")), !e.getElementsByTagName("*").length
                }), y.getElementsByClassName = he.test(D.getElementsByClassName), y.getById = o(function(e) {
                    return E.appendChild(e).id = N, !D.getElementsByName || !D.getElementsByName(N).length
                }), y.getById ? (b.filter.ID = function(e) {
                    var t = e.replace(ge, ye);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }, b.find.ID = function(e, t) {
                    if (void 0 !== t.getElementById && j) {
                        var n = t.getElementById(e);
                        return n ? [n] : []
                    }
                }) : (b.filter.ID = function(e) {
                    var t = e.replace(ge, ye);
                    return function(e) {
                        var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                        return n && n.value === t
                    }
                }, b.find.ID = function(e, t) {
                    if (void 0 !== t.getElementById && j) {
                        var n, i, o, r = t.getElementById(e);
                        if (r) {
                            if ((n = r.getAttributeNode("id")) && n.value === e) return [r];
                            for (o = t.getElementsByName(e), i = 0; r = o[i++];)
                                if ((n = r.getAttributeNode("id")) && n.value === e) return [r]
                        }
                        return []
                    }
                }), b.find.TAG = y.getElementsByTagName ? function(e, t) {
                    return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : y.qsa ? t.querySelectorAll(e) : void 0
                } : function(e, t) {
                    var n, i = [],
                        o = 0,
                        r = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (; n = r[o++];) 1 === n.nodeType && i.push(n);
                        return i
                    }
                    return r
                }, b.find.CLASS = y.getElementsByClassName && function(e, t) {
                    if (void 0 !== t.getElementsByClassName && j) return t.getElementsByClassName(e)
                }, M = [], O = [], (y.qsa = he.test(D.querySelectorAll)) && (o(function(e) {
                    E.appendChild(e).innerHTML = "<a id='" + N + "'></a><select id='" + N + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && O.push("[*^$]=" + Z + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || O.push("\\[" + Z + "*(?:value|" + Q + ")"), e.querySelectorAll("[id~=" + N + "-]").length || O.push("~="), e.querySelectorAll(":checked").length || O.push(":checked"), e.querySelectorAll("a#" + N + "+*").length || O.push(".#.+[+~]")
                }), o(function(e) {
                    e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                    var t = D.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && O.push("name" + Z + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && O.push(":enabled", ":disabled"), E.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && O.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), O.push(",.*:")
                })), (y.matchesSelector = he.test(L = E.matches || E.webkitMatchesSelector || E.mozMatchesSelector || E.oMatchesSelector || E.msMatchesSelector)) && o(function(e) {
                    y.disconnectedMatch = L.call(e, "*"), L.call(e, "[s!='']:x"), M.push("!=", ne)
                }), O = O.length && new RegExp(O.join("|")), M = M.length && new RegExp(M.join("|")), t = he.test(E.compareDocumentPosition), P = t || he.test(E.contains) ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                        i = t && t.parentNode;
                    return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                } : function(e, t) {
                    if (t)
                        for (; t = t.parentNode;)
                            if (t === e) return !0;
                    return !1
                }, W = t ? function(e, t) {
                    if (e === t) return T = !0, 0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !y.sortDetached && t.compareDocumentPosition(e) === n ? e === D || e.ownerDocument === I && P(I, e) ? -1 : t === D || t.ownerDocument === I && P(I, t) ? 1 : _ ? G(_, e) - G(_, t) : 0 : 4 & n ? -1 : 1)
                } : function(e, t) {
                    if (e === t) return T = !0, 0;
                    var n, i = 0,
                        o = e.parentNode,
                        r = t.parentNode,
                        a = [e],
                        l = [t];
                    if (!o || !r) return e === D ? -1 : t === D ? 1 : o ? -1 : r ? 1 : _ ? G(_, e) - G(_, t) : 0;
                    if (o === r) return s(e, t);
                    for (n = e; n = n.parentNode;) a.unshift(n);
                    for (n = t; n = n.parentNode;) l.unshift(n);
                    for (; a[i] === l[i];) i++;
                    return i ? s(a[i], l[i]) : a[i] === I ? -1 : l[i] === I ? 1 : 0
                }), D
            }, t.matches = function(e, n) {
                return t(e, null, null, n)
            }, t.matchesSelector = function(e, n) {
                if ((e.ownerDocument || e) !== D && A(e), y.matchesSelector && j && !z[n + " "] && (!M || !M.test(n)) && (!O || !O.test(n))) try {
                    var i = L.call(e, n);
                    if (i || y.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
                } catch (e) {
                    z(n, !0)
                }
                return 0 < t(n, D, null, [e]).length
            }, t.contains = function(e, t) {
                return (e.ownerDocument || e) !== D && A(e), P(e, t)
            }, t.attr = function(e, t) {
                (e.ownerDocument || e) !== D && A(e);
                var n = b.attrHandle[t.toLowerCase()],
                    i = n && U.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !j) : void 0;
                return void 0 !== i ? i : y.attributes || !j ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }, t.escape = function(e) {
                return (e + "").replace(be, we)
            }, t.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, t.uniqueSort = function(e) {
                var t, n = [],
                    i = 0,
                    o = 0;
                if (T = !y.detectDuplicates, _ = !y.sortStable && e.slice(0), e.sort(W), T) {
                    for (; t = e[o++];) t === e[o] && (i = n.push(o));
                    for (; i--;) e.splice(n[i], 1)
                }
                return _ = null, e
            }, w = t.getText = function(e) {
                var t, n = "",
                    i = 0,
                    o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += w(e)
                    } else if (3 === o || 4 === o) return e.nodeValue
                } else
                    for (; t = e[i++];) n += w(t);
                return n
            }, (b = t.selectors = {
                cacheLength: 50,
                createPseudo: i,
                match: de,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(ge, ye), e[3] = (e[3] || e[4] || e[5] || "").replace(ge, ye), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return de.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && le.test(n) && (t = C(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(ge, ye).toLowerCase();
                        return "*" === e ? function() {
                            return !0
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(e) {
                        var t = R[e + " "];
                        return t || (t = new RegExp("(^|" + Z + ")" + e + "(" + Z + "|$)")) && R(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(e, n, i) {
                        return function(o) {
                            var r = t.attr(o, e);
                            return null == r ? "!=" === n : !n || (r += "", "=" === n ? r === i : "!=" === n ? r !== i : "^=" === n ? i && 0 === r.indexOf(i) : "*=" === n ? i && -1 < r.indexOf(i) : "$=" === n ? i && r.slice(-i.length) === i : "~=" === n ? -1 < (" " + r.replace(ie, " ") + " ").indexOf(i) : "|=" === n && (r === i || r.slice(0, i.length + 1) === i + "-"))
                        }
                    },
                    CHILD: function(e, t, n, i, o) {
                        var r = "nth" !== e.slice(0, 3),
                            s = "last" !== e.slice(-4),
                            a = "of-type" === t;
                        return 1 === i && 0 === o ? function(e) {
                            return !!e.parentNode
                        } : function(t, n, l) {
                            var c, d, u, p, f, h, v = r !== s ? "nextSibling" : "previousSibling",
                                m = t.parentNode,
                                g = a && t.nodeName.toLowerCase(),
                                y = !l && !a,
                                b = !1;
                            if (m) {
                                if (r) {
                                    for (; v;) {
                                        for (p = t; p = p[v];)
                                            if (a ? p.nodeName.toLowerCase() === g : 1 === p.nodeType) return !1;
                                        h = v = "only" === e && !h && "nextSibling"
                                    }
                                    return !0
                                }
                                if (h = [s ? m.firstChild : m.lastChild], s && y) {
                                    for (b = (f = (c = (d = (u = (p = m)[N] || (p[N] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[e] || [])[0] === B && c[1]) && c[2], p = f && m.childNodes[f]; p = ++f && p && p[v] || (b = f = 0) || h.pop();)
                                        if (1 === p.nodeType && ++b && p === t) {
                                            d[e] = [B, f, b];
                                            break
                                        }
                                } else if (y && (b = f = (c = (d = (u = (p = t)[N] || (p[N] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[e] || [])[0] === B && c[1]), !1 === b)
                                    for (;
                                        (p = ++f && p && p[v] || (b = f = 0) || h.pop()) && ((a ? p.nodeName.toLowerCase() !== g : 1 !== p.nodeType) || !++b || (y && ((d = (u = p[N] || (p[N] = {}))[p.uniqueID] || (u[p.uniqueID] = {}))[e] = [B, b]), p !== t)););
                                return (b -= o) === i || b % i == 0 && 0 <= b / i
                            }
                        }
                    },
                    PSEUDO: function(e, n) {
                        var o, r = b.pseudos[e] || b.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return r[N] ? r(n) : 1 < r.length ? (o = [e, e, "", n], b.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function(e, t) {
                            for (var i, o = r(e, n), s = o.length; s--;) e[i = G(e, o[s])] = !(t[i] = o[s])
                        }) : function(e) {
                            return r(e, 0, o)
                        }) : r
                    }
                },
                pseudos: {
                    not: i(function(e) {
                        var t = [],
                            n = [],
                            o = $(e.replace(oe, "$1"));
                        return o[N] ? i(function(e, t, n, i) {
                            for (var r, s = o(e, null, i, []), a = e.length; a--;)(r = s[a]) && (e[a] = !(t[a] = r))
                        }) : function(e, i, r) {
                            return t[0] = e, o(t, null, r, n), t[0] = null, !n.pop()
                        }
                    }),
                    has: i(function(e) {
                        return function(n) {
                            return 0 < t(e, n).length
                        }
                    }),
                    contains: i(function(e) {
                        return e = e.replace(ge, ye),
                            function(t) {
                                return -1 < (t.textContent || w(t)).indexOf(e)
                            }
                    }),
                    lang: i(function(e) {
                        return ce.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(ge, ye).toLowerCase(),
                            function(t) {
                                var n;
                                do {
                                    if (n = j ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                                } while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1
                            }
                    }),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function(e) {
                        return e === E
                    },
                    focus: function(e) {
                        return e === D.activeElement && (!D.hasFocus || D.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: a(!1),
                    disabled: a(!0),
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !b.pseudos.empty(e)
                    },
                    header: function(e) {
                        return fe.test(e.nodeName)
                    },
                    input: function(e) {
                        return pe.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: l(function() {
                        return [0]
                    }),
                    last: l(function(e, t) {
                        return [t - 1]
                    }),
                    eq: l(function(e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: l(function(e, t) {
                        for (var n = 0; n < t; n += 2) e.push(n);
                        return e
                    }),
                    odd: l(function(e, t) {
                        for (var n = 1; n < t; n += 2) e.push(n);
                        return e
                    }),
                    lt: l(function(e, t, n) {
                        for (var i = n < 0 ? n + t : t < n ? t : n; 0 <= --i;) e.push(i);
                        return e
                    }),
                    gt: l(function(e, t, n) {
                        for (var i = n < 0 ? n + t : n; ++i < t;) e.push(i);
                        return e
                    })
                }
            }).pseudos.nth = b.pseudos.eq, {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) b.pseudos[g] = function(e) {
            return function(t) {
                return "input" === t.nodeName.toLowerCase() && t.type === e
            }
        }(g);
        for (g in {
                submit: !0,
                reset: !0
            }) b.pseudos[g] = function(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }(g);
        return d.prototype = b.filters = b.pseudos, b.setFilters = new d, C = t.tokenize = function(e, n) {
            var i, o, r, s, a, l, c, d = q[e + " "];
            if (d) return n ? 0 : d.slice(0);
            for (a = e, l = [], c = b.preFilter; a;) {
                for (s in i && !(o = re.exec(a)) || (o && (a = a.slice(o[0].length) || a), l.push(r = [])), i = !1, (o = se.exec(a)) && (i = o.shift(), r.push({
                        value: i,
                        type: o[0].replace(oe, " ")
                    }), a = a.slice(i.length)), b.filter) !(o = de[s].exec(a)) || c[s] && !(o = c[s](o)) || (i = o.shift(), r.push({
                    value: i,
                    type: s,
                    matches: o
                }), a = a.slice(i.length));
                if (!i) break
            }
            return n ? a.length : a ? t.error(e) : q(e, l).slice(0)
        }, $ = t.compile = function(e, n) {
            var o, r, s, a, l, c, d = [],
                u = [],
                p = F[e + " "];
            if (!p) {
                for (n || (n = C(e)), o = n.length; o--;)(p = m(n[o]))[N] ? d.push(p) : u.push(p);
                (p = F(e, (r = u, a = 0 < (s = d).length, l = 0 < r.length, c = function(e, n, i, o, c) {
                    var d, u, p, f = 0,
                        v = "0",
                        m = e && [],
                        g = [],
                        y = S,
                        w = e || l && b.find.TAG("*", c),
                        x = B += null == y ? 1 : Math.random() || .1,
                        C = w.length;
                    for (c && (S = n === D || n || c); v !== C && null != (d = w[v]); v++) {
                        if (l && d) {
                            for (u = 0, n || d.ownerDocument === D || (A(d), i = !j); p = r[u++];)
                                if (p(d, n || D, i)) {
                                    o.push(d);
                                    break
                                }
                            c && (B = x)
                        }
                        a && ((d = !p && d) && f--, e && m.push(d))
                    }
                    if (f += v, a && v !== f) {
                        for (u = 0; p = s[u++];) p(m, g, n, i);
                        if (e) {
                            if (0 < f)
                                for (; v--;) m[v] || g[v] || (g[v] = X.call(o));
                            g = h(g)
                        }
                        J.apply(o, g), c && !e && 0 < g.length && 1 < f + s.length && t.uniqueSort(o)
                    }
                    return c && (B = x, S = y), m
                }, a ? i(c) : c))).selector = e
            }
            return p
        }, k = t.select = function(e, t, n, i) {
            var o, r, s, a, l, d = "function" == typeof e && e,
                p = !i && C(e = d.selector || e);
            if (n = n || [], 1 === p.length) {
                if (2 < (r = p[0] = p[0].slice(0)).length && "ID" === (s = r[0]).type && 9 === t.nodeType && j && b.relative[r[1].type]) {
                    if (!(t = (b.find.ID(s.matches[0].replace(ge, ye), t) || [])[0])) return n;
                    d && (t = t.parentNode), e = e.slice(r.shift().value.length)
                }
                for (o = de.needsContext.test(e) ? 0 : r.length; o-- && (s = r[o], !b.relative[a = s.type]);)
                    if ((l = b.find[a]) && (i = l(s.matches[0].replace(ge, ye), me.test(r[0].type) && c(t.parentNode) || t))) {
                        if (r.splice(o, 1), !(e = i.length && u(r))) return J.apply(n, i), n;
                        break
                    }
            }
            return (d || $(e, p))(i, t, !j, n, !t || me.test(e) && c(t.parentNode) || t), n
        }, y.sortStable = N.split("").sort(W).join("") === N, y.detectDuplicates = !!T, A(), y.sortDetached = o(function(e) {
            return 1 & e.compareDocumentPosition(D.createElement("fieldset"))
        }), o(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || r("type|href|height|width", function(e, t, n) {
            if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), y.attributes && o(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || r("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
        }), o(function(e) {
            return null == e.getAttribute("disabled")
        }) || r(Q, function(e, t, n) {
            var i;
            if (!n) return !0 === e[t] ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
        }), t
    }(e);
    he.find = me, he.expr = me.selectors, he.expr[":"] = he.expr.pseudos, he.uniqueSort = he.unique = me.uniqueSort, he.text = me.getText, he.isXMLDoc = me.isXML, he.contains = me.contains, he.escapeSelector = me.escape;
    var ge = function(e, t, n) {
            for (var i = [], o = void 0 !== n;
                (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (o && he(e).is(n)) break;
                    i.push(e)
                }
            return i
        },
        ye = function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        },
        be = he.expr.match.needsContext,
        we = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    he.filter = function(e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? he.find.matchesSelector(i, e) ? [i] : [] : he.find.matches(e, he.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, he.fn.extend({
        find: function(e) {
            var t, n, i = this.length,
                o = this;
            if ("string" != typeof e) return this.pushStack(he(e).filter(function() {
                for (t = 0; t < i; t++)
                    if (he.contains(o[t], this)) return !0
            }));
            for (n = this.pushStack([]), t = 0; t < i; t++) he.find(e, o[t], n);
            return 1 < i ? he.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(s(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(s(this, e || [], !0))
        },
        is: function(e) {
            return !!s(this, "string" == typeof e && be.test(e) ? he(e) : e || [], !1).length
        }
    });
    var xe, Ce = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (he.fn.init = function(e, t, n) {
        var i, o;
        if (!e) return this;
        if (n = n || xe, "string" == typeof e) {
            if (!(i = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : Ce.exec(e)) || !i[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (i[1]) {
                if (t = t instanceof he ? t[0] : t, he.merge(this, he.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : Q, !0)), we.test(i[1]) && he.isPlainObject(t))
                    for (i in t) de(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
                return this
            }
            return (o = Q.getElementById(i[2])) && (this[0] = o, this.length = 1), this
        }
        return e.nodeType ? (this[0] = e, this.length = 1, this) : de(e) ? void 0 !== n.ready ? n.ready(e) : e(he) : he.makeArray(e, this)
    }).prototype = he.fn, xe = he(Q);
    var $e = /^(?:parents|prev(?:Until|All))/,
        ke = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    he.fn.extend({
        has: function(e) {
            var t = he(e, this),
                n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (he.contains(this, t[e])) return !0
            })
        },
        closest: function(e, t) {
            var n, i = 0,
                o = this.length,
                r = [],
                s = "string" != typeof e && he(e);
            if (!be.test(e))
                for (; i < o; i++)
                    for (n = this[i]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (s ? -1 < s.index(n) : 1 === n.nodeType && he.find.matchesSelector(n, e))) {
                            r.push(n);
                            break
                        }
            return this.pushStack(1 < r.length ? he.uniqueSort(r) : r)
        },
        index: function(e) {
            return e ? "string" == typeof e ? ie.call(he(e), this[0]) : ie.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(he.uniqueSort(he.merge(this.get(), he(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), he.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return ge(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return ge(e, "parentNode", n)
        },
        next: function(e) {
            return a(e, "nextSibling")
        },
        prev: function(e) {
            return a(e, "previousSibling")
        },
        nextAll: function(e) {
            return ge(e, "nextSibling")
        },
        prevAll: function(e) {
            return ge(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return ge(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return ge(e, "previousSibling", n)
        },
        siblings: function(e) {
            return ye((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return ye(e.firstChild)
        },
        contents: function(e) {
            return void 0 !== e.contentDocument ? e.contentDocument : (r(e, "template") && (e = e.content || e), he.merge([], e.childNodes))
        }
    }, function(e, t) {
        he.fn[e] = function(n, i) {
            var o = he.map(this, t, n);
            return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (o = he.filter(i, o)), 1 < this.length && (ke[e] || he.uniqueSort(o), $e.test(e) && o.reverse()), this.pushStack(o)
        }
    });
    var Se = /[^\x20\t\r\n\f]+/g;
    he.Callbacks = function(e) {
        var t, n;
        e = "string" == typeof e ? (t = e, n = {}, he.each(t.match(Se) || [], function(e, t) {
            n[t] = !0
        }), n) : he.extend({}, e);
        var o, r, s, a, l = [],
            c = [],
            d = -1,
            u = function() {
                for (a = a || e.once, s = o = !0; c.length; d = -1)
                    for (r = c.shift(); ++d < l.length;) !1 === l[d].apply(r[0], r[1]) && e.stopOnFalse && (d = l.length, r = !1);
                e.memory || (r = !1), o = !1, a && (l = r ? [] : "")
            },
            p = {
                add: function() {
                    return l && (r && !o && (d = l.length - 1, c.push(r)), function t(n) {
                        he.each(n, function(n, o) {
                            de(o) ? e.unique && p.has(o) || l.push(o) : o && o.length && "string" !== i(o) && t(o)
                        })
                    }(arguments), r && !o && u()), this
                },
                remove: function() {
                    return he.each(arguments, function(e, t) {
                        for (var n; - 1 < (n = he.inArray(t, l, n));) l.splice(n, 1), n <= d && d--
                    }), this
                },
                has: function(e) {
                    return e ? -1 < he.inArray(e, l) : 0 < l.length
                },
                empty: function() {
                    return l && (l = []), this
                },
                disable: function() {
                    return a = c = [], l = r = "", this
                },
                disabled: function() {
                    return !l
                },
                lock: function() {
                    return a = c = [], r || o || (l = r = ""), this
                },
                locked: function() {
                    return !!a
                },
                fireWith: function(e, t) {
                    return a || (t = [e, (t = t || []).slice ? t.slice() : t], c.push(t), o || u()), this
                },
                fire: function() {
                    return p.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!s
                }
            };
        return p
    }, he.extend({
        Deferred: function(t) {
            var n = [
                    ["notify", "progress", he.Callbacks("memory"), he.Callbacks("memory"), 2],
                    ["resolve", "done", he.Callbacks("once memory"), he.Callbacks("once memory"), 0, "resolved"],
                    ["reject", "fail", he.Callbacks("once memory"), he.Callbacks("once memory"), 1, "rejected"]
                ],
                i = "pending",
                o = {
                    state: function() {
                        return i
                    },
                    always: function() {
                        return r.done(arguments).fail(arguments), this
                    },
                    catch: function(e) {
                        return o.then(null, e)
                    },
                    pipe: function() {
                        var e = arguments;
                        return he.Deferred(function(t) {
                            he.each(n, function(n, i) {
                                var o = de(e[i[4]]) && e[i[4]];
                                r[i[1]](function() {
                                    var e = o && o.apply(this, arguments);
                                    e && de(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[i[0] + "With"](this, o ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    then: function(t, i, o) {
                        function r(t, n, i, o) {
                            return function() {
                                var a = this,
                                    d = arguments,
                                    u = function() {
                                        var e, u;
                                        if (!(t < s)) {
                                            if ((e = i.apply(a, d)) === n.promise()) throw new TypeError("Thenable self-resolution");
                                            u = e && ("object" == typeof e || "function" == typeof e) && e.then, de(u) ? o ? u.call(e, r(s, n, l, o), r(s, n, c, o)) : (s++, u.call(e, r(s, n, l, o), r(s, n, c, o), r(s, n, l, n.notifyWith))) : (i !== l && (a = void 0, d = [e]), (o || n.resolveWith)(a, d))
                                        }
                                    },
                                    p = o ? u : function() {
                                        try {
                                            u()
                                        } catch (e) {
                                            he.Deferred.exceptionHook && he.Deferred.exceptionHook(e, p.stackTrace), s <= t + 1 && (i !== c && (a = void 0, d = [e]), n.rejectWith(a, d))
                                        }
                                    };
                                t ? p() : (he.Deferred.getStackHook && (p.stackTrace = he.Deferred.getStackHook()), e.setTimeout(p))
                            }
                        }
                        var s = 0;
                        return he.Deferred(function(e) {
                            n[0][3].add(r(0, e, de(o) ? o : l, e.notifyWith)), n[1][3].add(r(0, e, de(t) ? t : l)), n[2][3].add(r(0, e, de(i) ? i : c))
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? he.extend(e, o) : o
                    }
                },
                r = {};
            return he.each(n, function(e, t) {
                var s = t[2],
                    a = t[5];
                o[t[1]] = s.add, a && s.add(function() {
                    i = a
                }, n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock), s.add(t[3].fire), r[t[0]] = function() {
                    return r[t[0] + "With"](this === r ? void 0 : this, arguments), this
                }, r[t[0] + "With"] = s.fireWith
            }), o.promise(r), t && t.call(r, r), r
        },
        when: function(e) {
            var t = arguments.length,
                n = t,
                i = Array(n),
                o = ee.call(arguments),
                r = he.Deferred(),
                s = function(e) {
                    return function(n) {
                        i[e] = this, o[e] = 1 < arguments.length ? ee.call(arguments) : n, --t || r.resolveWith(i, o)
                    }
                };
            if (t <= 1 && (d(e, r.done(s(n)).resolve, r.reject, !t), "pending" === r.state() || de(o[n] && o[n].then))) return r.then();
            for (; n--;) d(o[n], s(n), r.reject);
            return r.promise()
        }
    });
    var _e = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    he.Deferred.exceptionHook = function(t, n) {
        e.console && e.console.warn && t && _e.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
    }, he.readyException = function(t) {
        e.setTimeout(function() {
            throw t
        })
    };
    var Te = he.Deferred();
    he.fn.ready = function(e) {
        return Te.then(e).catch(function(e) {
            he.readyException(e)
        }), this
    }, he.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --he.readyWait : he.isReady) || (he.isReady = !0) !== e && 0 < --he.readyWait || Te.resolveWith(Q, [he])
        }
    }), he.ready.then = Te.then, "complete" === Q.readyState || "loading" !== Q.readyState && !Q.documentElement.doScroll ? e.setTimeout(he.ready) : (Q.addEventListener("DOMContentLoaded", u), e.addEventListener("load", u));
    var Ae = function(e, t, n, o, r, s, a) {
            var l = 0,
                c = e.length,
                d = null == n;
            if ("object" === i(n))
                for (l in r = !0, n) Ae(e, t, l, n[l], !0, s, a);
            else if (void 0 !== o && (r = !0, de(o) || (a = !0), d && (a ? (t.call(e, o), t = null) : (d = t, t = function(e, t, n) {
                    return d.call(he(e), n)
                })), t))
                for (; l < c; l++) t(e[l], n, a ? o : o.call(e[l], l, t(e[l], n)));
            return r ? e : d ? t.call(e) : c ? t(e[0], n) : s
        },
        De = /^-ms-/,
        Ee = /-([a-z])/g,
        je = function(e) {
            return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
        };
    h.uid = 1, h.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {}, je(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))), t
        },
        set: function(e, t, n) {
            var i, o = this.cache(e);
            if ("string" == typeof t) o[f(t)] = n;
            else
                for (i in t) o[f(i)] = t[i];
            return o
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][f(t)]
        },
        access: function(e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n, i = e[this.expando];
            if (void 0 !== i) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(f) : (t = f(t)) in i ? [t] : t.match(Se) || []).length;
                    for (; n--;) delete i[t[n]]
                }(void 0 === t || he.isEmptyObject(i)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return void 0 !== t && !he.isEmptyObject(t)
        }
    };
    var Oe = new h,
        Me = new h,
        Le = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Pe = /[A-Z]/g;
    he.extend({
        hasData: function(e) {
            return Me.hasData(e) || Oe.hasData(e)
        },
        data: function(e, t, n) {
            return Me.access(e, t, n)
        },
        removeData: function(e, t) {
            Me.remove(e, t)
        },
        _data: function(e, t, n) {
            return Oe.access(e, t, n)
        },
        _removeData: function(e, t) {
            Oe.remove(e, t)
        }
    }), he.fn.extend({
        data: function(e, t) {
            var n, i, o, r = this[0],
                s = r && r.attributes;
            if (void 0 === e) {
                if (this.length && (o = Me.get(r), 1 === r.nodeType && !Oe.get(r, "hasDataAttrs"))) {
                    for (n = s.length; n--;) s[n] && 0 === (i = s[n].name).indexOf("data-") && (i = f(i.slice(5)), v(r, i, o[i]));
                    Oe.set(r, "hasDataAttrs", !0)
                }
                return o
            }
            return "object" == typeof e ? this.each(function() {
                Me.set(this, e)
            }) : Ae(this, function(t) {
                var n;
                if (r && void 0 === t) return void 0 !== (n = Me.get(r, e)) ? n : void 0 !== (n = v(r, e)) ? n : void 0;
                this.each(function() {
                    Me.set(this, e, t)
                })
            }, null, t, 1 < arguments.length, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                Me.remove(this, e)
            })
        }
    }), he.extend({
        queue: function(e, t, n) {
            var i;
            if (e) return t = (t || "fx") + "queue", i = Oe.get(e, t), n && (!i || Array.isArray(n) ? i = Oe.access(e, t, he.makeArray(n)) : i.push(n)), i || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = he.queue(e, t),
                i = n.length,
                o = n.shift(),
                r = he._queueHooks(e, t);
            "inprogress" === o && (o = n.shift(), i--), o && ("fx" === t && n.unshift("inprogress"), delete r.stop, o.call(e, function() {
                he.dequeue(e, t)
            }, r)), !i && r && r.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return Oe.get(e, n) || Oe.access(e, n, {
                empty: he.Callbacks("once memory").add(function() {
                    Oe.remove(e, [t + "queue", n])
                })
            })
        }
    }), he.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? he.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = he.queue(this, e, t);
                he._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && he.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                he.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, i = 1,
                o = he.Deferred(),
                r = this,
                s = this.length,
                a = function() {
                    --i || o.resolveWith(r, [r])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; s--;)(n = Oe.get(r[s], e + "queueHooks")) && n.empty && (i++, n.empty.add(a));
            return a(), o.promise(t)
        }
    });
    var Ne = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        Ie = new RegExp("^(?:([+-])=|)(" + Ne + ")([a-z%]*)$", "i"),
        Be = ["Top", "Right", "Bottom", "Left"],
        He = Q.documentElement,
        Re = function(e) {
            return he.contains(e.ownerDocument, e)
        },
        qe = {
            composed: !0
        };
    He.getRootNode && (Re = function(e) {
        return he.contains(e.ownerDocument, e) || e.getRootNode(qe) === e.ownerDocument
    });
    var Fe = function(e, t) {
            return "none" === (e = t || e).style.display || "" === e.style.display && Re(e) && "none" === he.css(e, "display")
        },
        ze = function(e, t, n, i) {
            var o, r, s = {};
            for (r in t) s[r] = e.style[r], e.style[r] = t[r];
            for (r in o = n.apply(e, i || []), t) e.style[r] = s[r];
            return o
        },
        We = {};
    he.fn.extend({
        show: function() {
            return g(this, !0)
        },
        hide: function() {
            return g(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Fe(this) ? he(this).show() : he(this).hide()
            })
        }
    });
    var Ue = /^(?:checkbox|radio)$/i,
        Ve = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
        Xe = /^$|^module$|\/(?:java|ecma)script/i,
        Ye = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    Ye.optgroup = Ye.option, Ye.tbody = Ye.tfoot = Ye.colgroup = Ye.caption = Ye.thead, Ye.th = Ye.td;
    var Je, Ke, Ge = /<|&#?\w+;/;
    Je = Q.createDocumentFragment().appendChild(Q.createElement("div")), (Ke = Q.createElement("input")).setAttribute("type", "radio"), Ke.setAttribute("checked", "checked"), Ke.setAttribute("name", "t"), Je.appendChild(Ke), ce.checkClone = Je.cloneNode(!0).cloneNode(!0).lastChild.checked, Je.innerHTML = "<textarea>x</textarea>", ce.noCloneChecked = !!Je.cloneNode(!0).lastChild.defaultValue;
    var Qe = /^key/,
        Ze = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        et = /^([^.]*)(?:\.(.+)|)/;
    he.event = {
        global: {},
        add: function(e, t, n, i, o) {
            var r, s, a, l, c, d, u, p, f, h, v, m = Oe.get(e);
            if (m)
                for (n.handler && (n = (r = n).handler, o = r.selector), o && he.find.matchesSelector(He, o), n.guid || (n.guid = he.guid++), (l = m.events) || (l = m.events = {}), (s = m.handle) || (s = m.handle = function(t) {
                        return void 0 !== he && he.event.triggered !== t.type ? he.event.dispatch.apply(e, arguments) : void 0
                    }), c = (t = (t || "").match(Se) || [""]).length; c--;) f = v = (a = et.exec(t[c]) || [])[1], h = (a[2] || "").split(".").sort(), f && (u = he.event.special[f] || {}, f = (o ? u.delegateType : u.bindType) || f, u = he.event.special[f] || {}, d = he.extend({
                    type: f,
                    origType: v,
                    data: i,
                    handler: n,
                    guid: n.guid,
                    selector: o,
                    needsContext: o && he.expr.match.needsContext.test(o),
                    namespace: h.join(".")
                }, r), (p = l[f]) || ((p = l[f] = []).delegateCount = 0, u.setup && !1 !== u.setup.call(e, i, h, s) || e.addEventListener && e.addEventListener(f, s)), u.add && (u.add.call(e, d), d.handler.guid || (d.handler.guid = n.guid)), o ? p.splice(p.delegateCount++, 0, d) : p.push(d), he.event.global[f] = !0)
        },
        remove: function(e, t, n, i, o) {
            var r, s, a, l, c, d, u, p, f, h, v, m = Oe.hasData(e) && Oe.get(e);
            if (m && (l = m.events)) {
                for (c = (t = (t || "").match(Se) || [""]).length; c--;)
                    if (f = v = (a = et.exec(t[c]) || [])[1], h = (a[2] || "").split(".").sort(), f) {
                        for (u = he.event.special[f] || {}, p = l[f = (i ? u.delegateType : u.bindType) || f] || [], a = a[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = r = p.length; r--;) d = p[r], !o && v !== d.origType || n && n.guid !== d.guid || a && !a.test(d.namespace) || i && i !== d.selector && ("**" !== i || !d.selector) || (p.splice(r, 1), d.selector && p.delegateCount--, u.remove && u.remove.call(e, d));
                        s && !p.length && (u.teardown && !1 !== u.teardown.call(e, h, m.handle) || he.removeEvent(e, f, m.handle), delete l[f])
                    } else
                        for (f in l) he.event.remove(e, f + t[c], n, i, !0);
                he.isEmptyObject(l) && Oe.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, i, o, r, s, a = he.event.fix(e),
                l = new Array(arguments.length),
                c = (Oe.get(this, "events") || {})[a.type] || [],
                d = he.event.special[a.type] || {};
            for (l[0] = a, t = 1; t < arguments.length; t++) l[t] = arguments[t];
            if (a.delegateTarget = this, !d.preDispatch || !1 !== d.preDispatch.call(this, a)) {
                for (s = he.event.handlers.call(this, a, c), t = 0;
                    (o = s[t++]) && !a.isPropagationStopped();)
                    for (a.currentTarget = o.elem, n = 0;
                        (r = o.handlers[n++]) && !a.isImmediatePropagationStopped();) a.rnamespace && !1 !== r.namespace && !a.rnamespace.test(r.namespace) || (a.handleObj = r, a.data = r.data, void 0 !== (i = ((he.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, l)) && !1 === (a.result = i) && (a.preventDefault(), a.stopPropagation()));
                return d.postDispatch && d.postDispatch.call(this, a), a.result
            }
        },
        handlers: function(e, t) {
            var n, i, o, r, s, a = [],
                l = t.delegateCount,
                c = e.target;
            if (l && c.nodeType && !("click" === e.type && 1 <= e.button))
                for (; c !== this; c = c.parentNode || this)
                    if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
                        for (r = [], s = {}, n = 0; n < l; n++) void 0 === s[o = (i = t[n]).selector + " "] && (s[o] = i.needsContext ? -1 < he(o, this).index(c) : he.find(o, this, null, [c]).length), s[o] && r.push(i);
                        r.length && a.push({
                            elem: c,
                            handlers: r
                        })
                    }
            return c = this, l < t.length && a.push({
                elem: c,
                handlers: t.slice(l)
            }), a
        },
        addProp: function(e, t) {
            Object.defineProperty(he.Event.prototype, e, {
                enumerable: !0,
                configurable: !0,
                get: de(t) ? function() {
                    if (this.originalEvent) return t(this.originalEvent)
                } : function() {
                    if (this.originalEvent) return this.originalEvent[e]
                },
                set: function(t) {
                    Object.defineProperty(this, e, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: t
                    })
                }
            })
        },
        fix: function(e) {
            return e[he.expando] ? e : new he.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    var t = this || e;
                    return Ue.test(t.type) && t.click && r(t, "input") && S(t, "click", x), !1
                },
                trigger: function(e) {
                    var t = this || e;
                    return Ue.test(t.type) && t.click && r(t, "input") && S(t, "click"), !0
                },
                _default: function(e) {
                    var t = e.target;
                    return Ue.test(t.type) && t.click && r(t, "input") && Oe.get(t, "click") || r(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    }, he.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }, he.Event = function(e, t) {
        if (!(this instanceof he.Event)) return new he.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? x : C, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && he.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[he.expando] = !0
    }, he.Event.prototype = {
        constructor: he.Event,
        isDefaultPrevented: C,
        isPropagationStopped: C,
        isImmediatePropagationStopped: C,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = x, e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = x, e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = x, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, he.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(e) {
            var t = e.button;
            return null == e.which && Qe.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Ze.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, he.event.addProp), he.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        he.event.special[e] = {
            setup: function() {
                return S(this, e, $), !1
            },
            trigger: function() {
                return S(this, e), !0
            },
            delegateType: t
        }
    }), he.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        he.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, i = e.relatedTarget,
                    o = e.handleObj;
                return i && (i === this || he.contains(this, i)) || (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), he.fn.extend({
        on: function(e, t, n, i) {
            return k(this, e, t, n, i)
        },
        one: function(e, t, n, i) {
            return k(this, e, t, n, i, 1)
        },
        off: function(e, t, n) {
            var i, o;
            if (e && e.preventDefault && e.handleObj) return i = e.handleObj, he(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" == typeof e) {
                for (o in e) this.off(o, t, e[o]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = C), this.each(function() {
                he.event.remove(this, e, n, t)
            })
        }
    });
    var tt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
        nt = /<script|<style|<link/i,
        it = /checked\s*(?:[^=]|=\s*.checked.)/i,
        ot = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    he.extend({
        htmlPrefilter: function(e) {
            return e.replace(tt, "<$1></$2>")
        },
        clone: function(e, t, n) {
            var i, o, r, s, a, l, c, d = e.cloneNode(!0),
                u = Re(e);
            if (!(ce.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || he.isXMLDoc(e)))
                for (s = y(d), i = 0, o = (r = y(e)).length; i < o; i++) a = r[i], l = s[i], "input" === (c = l.nodeName.toLowerCase()) && Ue.test(a.type) ? l.checked = a.checked : "input" !== c && "textarea" !== c || (l.defaultValue = a.defaultValue);
            if (t)
                if (n)
                    for (r = r || y(e), s = s || y(d), i = 0, o = r.length; i < o; i++) D(r[i], s[i]);
                else D(e, d);
            return 0 < (s = y(d, "script")).length && b(s, !u && y(e, "script")), d
        },
        cleanData: function(e) {
            for (var t, n, i, o = he.event.special, r = 0; void 0 !== (n = e[r]); r++)
                if (je(n)) {
                    if (t = n[Oe.expando]) {
                        if (t.events)
                            for (i in t.events) o[i] ? he.event.remove(n, i) : he.removeEvent(n, i, t.handle);
                        n[Oe.expando] = void 0
                    }
                    n[Me.expando] && (n[Me.expando] = void 0)
                }
        }
    }), he.fn.extend({
        detach: function(e) {
            return j(this, e, !0)
        },
        remove: function(e) {
            return j(this, e)
        },
        text: function(e) {
            return Ae(this, function(e) {
                return void 0 === e ? he.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return E(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || _(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return E(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = _(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return E(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return E(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (he.cleanData(y(e, !1)), e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function() {
                return he.clone(this, e, t)
            })
        },
        html: function(e) {
            return Ae(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    i = this.length;
                if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                if ("string" == typeof e && !nt.test(e) && !Ye[(Ve.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = he.htmlPrefilter(e);
                    try {
                        for (; n < i; n++) 1 === (t = this[n] || {}).nodeType && (he.cleanData(y(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = [];
            return E(this, arguments, function(t) {
                var n = this.parentNode;
                he.inArray(this, e) < 0 && (he.cleanData(y(this)), n && n.replaceChild(t, this))
            }, e)
        }
    }), he.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        he.fn[e] = function(e) {
            for (var n, i = [], o = he(e), r = o.length - 1, s = 0; s <= r; s++) n = s === r ? this : this.clone(!0), he(o[s])[t](n),
                ne.apply(i, n.get());
            return this.pushStack(i)
        }
    });
    var rt = new RegExp("^(" + Ne + ")(?!px)[a-z%]+$", "i"),
        st = function(t) {
            var n = t.ownerDocument.defaultView;
            return n && n.opener || (n = e), n.getComputedStyle(t)
        },
        at = new RegExp(Be.join("|"), "i");
    ! function() {
        function t() {
            if (c) {
                l.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", c.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", He.appendChild(l).appendChild(c);
                var t = e.getComputedStyle(c);
                i = "1%" !== t.top, a = 12 === n(t.marginLeft), c.style.right = "60%", s = 36 === n(t.right), o = 36 === n(t.width), c.style.position = "absolute", r = 12 === n(c.offsetWidth / 3), He.removeChild(l), c = null
            }
        }

        function n(e) {
            return Math.round(parseFloat(e))
        }
        var i, o, r, s, a, l = Q.createElement("div"),
            c = Q.createElement("div");
        c.style && (c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", ce.clearCloneStyle = "content-box" === c.style.backgroundClip, he.extend(ce, {
            boxSizingReliable: function() {
                return t(), o
            },
            pixelBoxStyles: function() {
                return t(), s
            },
            pixelPosition: function() {
                return t(), i
            },
            reliableMarginLeft: function() {
                return t(), a
            },
            scrollboxSize: function() {
                return t(), r
            }
        }))
    }();
    var lt = ["Webkit", "Moz", "ms"],
        ct = Q.createElement("div").style,
        dt = {},
        ut = /^(none|table(?!-c[ea]).+)/,
        pt = /^--/,
        ft = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        ht = {
            letterSpacing: "0",
            fontWeight: "400"
        };
    he.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = O(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var o, r, s, a = f(t),
                    l = pt.test(t),
                    c = e.style;
                if (l || (t = L(a)), s = he.cssHooks[t] || he.cssHooks[a], void 0 === n) return s && "get" in s && void 0 !== (o = s.get(e, !1, i)) ? o : c[t];
                "string" == (r = typeof n) && (o = Ie.exec(n)) && o[1] && (n = m(e, t, o), r = "number"), null != n && n == n && ("number" !== r || l || (n += o && o[3] || (he.cssNumber[a] ? "" : "px")), ce.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (c[t] = "inherit"), s && "set" in s && void 0 === (n = s.set(e, n, i)) || (l ? c.setProperty(t, n) : c[t] = n))
            }
        },
        css: function(e, t, n, i) {
            var o, r, s, a = f(t);
            return pt.test(t) || (t = L(a)), (s = he.cssHooks[t] || he.cssHooks[a]) && "get" in s && (o = s.get(e, !0, n)), void 0 === o && (o = O(e, t, i)), "normal" === o && t in ht && (o = ht[t]), "" === n || n ? (r = parseFloat(o), !0 === n || isFinite(r) ? r || 0 : o) : o
        }
    }), he.each(["height", "width"], function(e, t) {
        he.cssHooks[t] = {
            get: function(e, n, i) {
                if (n) return !ut.test(he.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? I(e, t, i) : ze(e, ft, function() {
                    return I(e, t, i)
                })
            },
            set: function(e, n, i) {
                var o, r = st(e),
                    s = !ce.scrollboxSize() && "absolute" === r.position,
                    a = (s || i) && "border-box" === he.css(e, "boxSizing", !1, r),
                    l = i ? N(e, t, i, a, r) : 0;
                return a && s && (l -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(r[t]) - N(e, t, "border", !1, r) - .5)), l && (o = Ie.exec(n)) && "px" !== (o[3] || "px") && (e.style[t] = n, n = he.css(e, t)), P(0, n, l)
            }
        }
    }), he.cssHooks.marginLeft = M(ce.reliableMarginLeft, function(e, t) {
        if (t) return (parseFloat(O(e, "marginLeft")) || e.getBoundingClientRect().left - ze(e, {
            marginLeft: 0
        }, function() {
            return e.getBoundingClientRect().left
        })) + "px"
    }), he.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        he.cssHooks[e + t] = {
            expand: function(n) {
                for (var i = 0, o = {}, r = "string" == typeof n ? n.split(" ") : [n]; i < 4; i++) o[e + Be[i] + t] = r[i] || r[i - 2] || r[0];
                return o
            }
        }, "margin" !== e && (he.cssHooks[e + t].set = P)
    }), he.fn.extend({
        css: function(e, t) {
            return Ae(this, function(e, t, n) {
                var i, o, r = {},
                    s = 0;
                if (Array.isArray(t)) {
                    for (i = st(e), o = t.length; s < o; s++) r[t[s]] = he.css(e, t[s], !1, i);
                    return r
                }
                return void 0 !== n ? he.style(e, t, n) : he.css(e, t)
            }, e, t, 1 < arguments.length)
        }
    }), ((he.Tween = B).prototype = {
        constructor: B,
        init: function(e, t, n, i, o, r) {
            this.elem = e, this.prop = n, this.easing = o || he.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = r || (he.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = B.propHooks[this.prop];
            return e && e.get ? e.get(this) : B.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = B.propHooks[this.prop];
            return this.options.duration ? this.pos = t = he.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : B.propHooks._default.set(this), this
        }
    }).init.prototype = B.prototype, (B.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = he.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                he.fx.step[e.prop] ? he.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !he.cssHooks[e.prop] && null == e.elem.style[L(e.prop)] ? e.elem[e.prop] = e.now : he.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }).scrollTop = B.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, he.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, he.fx = B.prototype.init, he.fx.step = {};
    var vt, mt, gt, yt, bt = /^(?:toggle|show|hide)$/,
        wt = /queueHooks$/;
    he.Animation = he.extend(z, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return m(n.elem, e, Ie.exec(t), n), n
            }]
        },
        tweener: function(e, t) {
            de(e) ? (t = e, e = ["*"]) : e = e.match(Se);
            for (var n, i = 0, o = e.length; i < o; i++) n = e[i], z.tweeners[n] = z.tweeners[n] || [], z.tweeners[n].unshift(t)
        },
        prefilters: [function(e, t, n) {
            var i, o, r, s, a, l, c, d, u = "width" in t || "height" in t,
                p = this,
                f = {},
                h = e.style,
                v = e.nodeType && Fe(e),
                m = Oe.get(e, "fxshow");
            for (i in n.queue || (null == (s = he._queueHooks(e, "fx")).unqueued && (s.unqueued = 0, a = s.empty.fire, s.empty.fire = function() {
                    s.unqueued || a()
                }), s.unqueued++, p.always(function() {
                    p.always(function() {
                        s.unqueued--, he.queue(e, "fx").length || s.empty.fire()
                    })
                })), t)
                if (o = t[i], bt.test(o)) {
                    if (delete t[i], r = r || "toggle" === o, o === (v ? "hide" : "show")) {
                        if ("show" !== o || !m || void 0 === m[i]) continue;
                        v = !0
                    }
                    f[i] = m && m[i] || he.style(e, i)
                }
            if ((l = !he.isEmptyObject(t)) || !he.isEmptyObject(f))
                for (i in u && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY], null == (c = m && m.display) && (c = Oe.get(e, "display")), "none" === (d = he.css(e, "display")) && (c ? d = c : (g([e], !0), c = e.style.display || c, d = he.css(e, "display"), g([e]))), ("inline" === d || "inline-block" === d && null != c) && "none" === he.css(e, "float") && (l || (p.done(function() {
                        h.display = c
                    }), null == c && (d = h.display, c = "none" === d ? "" : d)), h.display = "inline-block")), n.overflow && (h.overflow = "hidden", p.always(function() {
                        h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
                    })), l = !1, f) l || (m ? "hidden" in m && (v = m.hidden) : m = Oe.access(e, "fxshow", {
                    display: c
                }), r && (m.hidden = !v), v && g([e], !0), p.done(function() {
                    for (i in v || g([e]), Oe.remove(e, "fxshow"), f) he.style(e, i, f[i])
                })), l = F(v ? m[i] : 0, i, p), i in m || (m[i] = l.start, v && (l.end = l.start, l.start = 0))
        }],
        prefilter: function(e, t) {
            t ? z.prefilters.unshift(e) : z.prefilters.push(e)
        }
    }), he.speed = function(e, t, n) {
        var i = e && "object" == typeof e ? he.extend({}, e) : {
            complete: n || !n && t || de(e) && e,
            duration: e,
            easing: n && t || t && !de(t) && t
        };
        return he.fx.off ? i.duration = 0 : "number" != typeof i.duration && (i.duration in he.fx.speeds ? i.duration = he.fx.speeds[i.duration] : i.duration = he.fx.speeds._default), null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function() {
            de(i.old) && i.old.call(this), i.queue && he.dequeue(this, i.queue)
        }, i
    }, he.fn.extend({
        fadeTo: function(e, t, n, i) {
            return this.filter(Fe).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, i)
        },
        animate: function(e, t, n, i) {
            var o = he.isEmptyObject(e),
                r = he.speed(t, n, i),
                s = function() {
                    var t = z(this, he.extend({}, e), r);
                    (o || Oe.get(this, "finish")) && t.stop(!0)
                };
            return s.finish = s, o || !1 === r.queue ? this.each(s) : this.queue(r.queue, s)
        },
        stop: function(e, t, n) {
            var i = function(e) {
                var t = e.stop;
                delete e.stop, t(n)
            };
            return "string" != typeof e && (n = t, t = e, e = void 0), t && !1 !== e && this.queue(e || "fx", []), this.each(function() {
                var t = !0,
                    o = null != e && e + "queueHooks",
                    r = he.timers,
                    s = Oe.get(this);
                if (o) s[o] && s[o].stop && i(s[o]);
                else
                    for (o in s) s[o] && s[o].stop && wt.test(o) && i(s[o]);
                for (o = r.length; o--;) r[o].elem !== this || null != e && r[o].queue !== e || (r[o].anim.stop(n), t = !1, r.splice(o, 1));
                !t && n || he.dequeue(this, e)
            })
        },
        finish: function(e) {
            return !1 !== e && (e = e || "fx"), this.each(function() {
                var t, n = Oe.get(this),
                    i = n[e + "queue"],
                    o = n[e + "queueHooks"],
                    r = he.timers,
                    s = i ? i.length : 0;
                for (n.finish = !0, he.queue(this, e, []), o && o.stop && o.stop.call(this, !0), t = r.length; t--;) r[t].elem === this && r[t].queue === e && (r[t].anim.stop(!0), r.splice(t, 1));
                for (t = 0; t < s; t++) i[t] && i[t].finish && i[t].finish.call(this);
                delete n.finish
            })
        }
    }), he.each(["toggle", "show", "hide"], function(e, t) {
        var n = he.fn[t];
        he.fn[t] = function(e, i, o) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(q(t, !0), e, i, o)
        }
    }), he.each({
        slideDown: q("show"),
        slideUp: q("hide"),
        slideToggle: q("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        he.fn[e] = function(e, n, i) {
            return this.animate(t, e, n, i)
        }
    }), he.timers = [], he.fx.tick = function() {
        var e, t = 0,
            n = he.timers;
        for (vt = Date.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || he.fx.stop(), vt = void 0
    }, he.fx.timer = function(e) {
        he.timers.push(e), he.fx.start()
    }, he.fx.interval = 13, he.fx.start = function() {
        mt || (mt = !0, H())
    }, he.fx.stop = function() {
        mt = null
    }, he.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, he.fn.delay = function(t, n) {
        return t = he.fx && he.fx.speeds[t] || t, n = n || "fx", this.queue(n, function(n, i) {
            var o = e.setTimeout(n, t);
            i.stop = function() {
                e.clearTimeout(o)
            }
        })
    }, gt = Q.createElement("input"), yt = Q.createElement("select").appendChild(Q.createElement("option")), gt.type = "checkbox", ce.checkOn = "" !== gt.value, ce.optSelected = yt.selected, (gt = Q.createElement("input")).value = "t", gt.type = "radio", ce.radioValue = "t" === gt.value;
    var xt, Ct = he.expr.attrHandle;
    he.fn.extend({
        attr: function(e, t) {
            return Ae(this, he.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                he.removeAttr(this, e)
            })
        }
    }), he.extend({
        attr: function(e, t, n) {
            var i, o, r = e.nodeType;
            if (3 !== r && 8 !== r && 2 !== r) return void 0 === e.getAttribute ? he.prop(e, t, n) : (1 === r && he.isXMLDoc(e) || (o = he.attrHooks[t.toLowerCase()] || (he.expr.match.bool.test(t) ? xt : void 0)), void 0 !== n ? null === n ? void he.removeAttr(e, t) : o && "set" in o && void 0 !== (i = o.set(e, n, t)) ? i : (e.setAttribute(t, n + ""), n) : o && "get" in o && null !== (i = o.get(e, t)) ? i : null == (i = he.find.attr(e, t)) ? void 0 : i)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!ce.radioValue && "radio" === t && r(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, i = 0,
                o = t && t.match(Se);
            if (o && 1 === e.nodeType)
                for (; n = o[i++];) e.removeAttribute(n)
        }
    }), xt = {
        set: function(e, t, n) {
            return !1 === t ? he.removeAttr(e, n) : e.setAttribute(n, n), n
        }
    }, he.each(he.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = Ct[t] || he.find.attr;
        Ct[t] = function(e, t, i) {
            var o, r, s = t.toLowerCase();
            return i || (r = Ct[s], Ct[s] = o, o = null != n(e, t, i) ? s : null, Ct[s] = r), o
        }
    });
    var $t = /^(?:input|select|textarea|button)$/i,
        kt = /^(?:a|area)$/i;
    he.fn.extend({
        prop: function(e, t) {
            return Ae(this, he.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[he.propFix[e] || e]
            })
        }
    }), he.extend({
        prop: function(e, t, n) {
            var i, o, r = e.nodeType;
            if (3 !== r && 8 !== r && 2 !== r) return 1 === r && he.isXMLDoc(e) || (t = he.propFix[t] || t, o = he.propHooks[t]), void 0 !== n ? o && "set" in o && void 0 !== (i = o.set(e, n, t)) ? i : e[t] = n : o && "get" in o && null !== (i = o.get(e, t)) ? i : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = he.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : $t.test(e.nodeName) || kt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }), ce.optSelected || (he.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    }), he.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        he.propFix[this.toLowerCase()] = this
    }), he.fn.extend({
        addClass: function(e) {
            var t, n, i, o, r, s, a, l = 0;
            if (de(e)) return this.each(function(t) {
                he(this).addClass(e.call(this, t, U(this)))
            });
            if ((t = V(e)).length)
                for (; n = this[l++];)
                    if (o = U(n), i = 1 === n.nodeType && " " + W(o) + " ") {
                        for (s = 0; r = t[s++];) i.indexOf(" " + r + " ") < 0 && (i += r + " ");
                        o !== (a = W(i)) && n.setAttribute("class", a)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, i, o, r, s, a, l = 0;
            if (de(e)) return this.each(function(t) {
                he(this).removeClass(e.call(this, t, U(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ((t = V(e)).length)
                for (; n = this[l++];)
                    if (o = U(n), i = 1 === n.nodeType && " " + W(o) + " ") {
                        for (s = 0; r = t[s++];)
                            for (; - 1 < i.indexOf(" " + r + " ");) i = i.replace(" " + r + " ", " ");
                        o !== (a = W(i)) && n.setAttribute("class", a)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e,
                i = "string" === n || Array.isArray(e);
            return "boolean" == typeof t && i ? t ? this.addClass(e) : this.removeClass(e) : de(e) ? this.each(function(n) {
                he(this).toggleClass(e.call(this, n, U(this), t), t)
            }) : this.each(function() {
                var t, o, r, s;
                if (i)
                    for (o = 0, r = he(this), s = V(e); t = s[o++];) r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
                else void 0 !== e && "boolean" !== n || ((t = U(this)) && Oe.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : Oe.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, i = 0;
            for (t = " " + e + " "; n = this[i++];)
                if (1 === n.nodeType && -1 < (" " + W(U(n)) + " ").indexOf(t)) return !0;
            return !1
        }
    });
    var St = /\r/g;
    he.fn.extend({
        val: function(e) {
            var t, n, i, o = this[0];
            return arguments.length ? (i = de(e), this.each(function(n) {
                var o;
                1 === this.nodeType && (null == (o = i ? e.call(this, n, he(this).val()) : e) ? o = "" : "number" == typeof o ? o += "" : Array.isArray(o) && (o = he.map(o, function(e) {
                    return null == e ? "" : e + ""
                })), (t = he.valHooks[this.type] || he.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, o, "value") || (this.value = o))
            })) : o ? (t = he.valHooks[o.type] || he.valHooks[o.nodeName.toLowerCase()]) && "get" in t && void 0 !== (n = t.get(o, "value")) ? n : "string" == typeof(n = o.value) ? n.replace(St, "") : null == n ? "" : n : void 0
        }
    }), he.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = he.find.attr(e, "value");
                    return null != t ? t : W(he.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t, n, i, o = e.options,
                        s = e.selectedIndex,
                        a = "select-one" === e.type,
                        l = a ? null : [],
                        c = a ? s + 1 : o.length;
                    for (i = s < 0 ? c : a ? s : 0; i < c; i++)
                        if (((n = o[i]).selected || i === s) && !n.disabled && (!n.parentNode.disabled || !r(n.parentNode, "optgroup"))) {
                            if (t = he(n).val(), a) return t;
                            l.push(t)
                        }
                    return l
                },
                set: function(e, t) {
                    for (var n, i, o = e.options, r = he.makeArray(t), s = o.length; s--;)((i = o[s]).selected = -1 < he.inArray(he.valHooks.option.get(i), r)) && (n = !0);
                    return n || (e.selectedIndex = -1), r
                }
            }
        }
    }), he.each(["radio", "checkbox"], function() {
        he.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t)) return e.checked = -1 < he.inArray(he(e).val(), t)
            }
        }, ce.checkOn || (he.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    }), ce.focusin = "onfocusin" in e;
    var _t = /^(?:focusinfocus|focusoutblur)$/,
        Tt = function(e) {
            e.stopPropagation()
        };
    he.extend(he.event, {
        trigger: function(t, n, i, o) {
            var r, s, a, l, c, d, u, p, f = [i || Q],
                h = se.call(t, "type") ? t.type : t,
                v = se.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = p = a = i = i || Q, 3 !== i.nodeType && 8 !== i.nodeType && !_t.test(h + he.event.triggered) && (-1 < h.indexOf(".") && (h = (v = h.split(".")).shift(), v.sort()), c = h.indexOf(":") < 0 && "on" + h, (t = t[he.expando] ? t : new he.Event(h, "object" == typeof t && t)).isTrigger = o ? 2 : 3, t.namespace = v.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + v.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), n = null == n ? [t] : he.makeArray(n, [t]), u = he.event.special[h] || {}, o || !u.trigger || !1 !== u.trigger.apply(i, n))) {
                if (!o && !u.noBubble && !ue(i)) {
                    for (l = u.delegateType || h, _t.test(l + h) || (s = s.parentNode); s; s = s.parentNode) f.push(s), a = s;
                    a === (i.ownerDocument || Q) && f.push(a.defaultView || a.parentWindow || e)
                }
                for (r = 0;
                    (s = f[r++]) && !t.isPropagationStopped();) p = s, t.type = 1 < r ? l : u.bindType || h, (d = (Oe.get(s, "events") || {})[t.type] && Oe.get(s, "handle")) && d.apply(s, n), (d = c && s[c]) && d.apply && je(s) && (t.result = d.apply(s, n), !1 === t.result && t.preventDefault());
                return t.type = h, o || t.isDefaultPrevented() || u._default && !1 !== u._default.apply(f.pop(), n) || !je(i) || c && de(i[h]) && !ue(i) && ((a = i[c]) && (i[c] = null), he.event.triggered = h, t.isPropagationStopped() && p.addEventListener(h, Tt), i[h](), t.isPropagationStopped() && p.removeEventListener(h, Tt), he.event.triggered = void 0, a && (i[c] = a)), t.result
            }
        },
        simulate: function(e, t, n) {
            var i = he.extend(new he.Event, n, {
                type: e,
                isSimulated: !0
            });
            he.event.trigger(i, null, t)
        }
    }), he.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                he.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n) return he.event.trigger(e, t, n, !0)
        }
    }), ce.focusin || he.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            he.event.simulate(t, e.target, he.event.fix(e))
        };
        he.event.special[t] = {
            setup: function() {
                var i = this.ownerDocument || this,
                    o = Oe.access(i, t);
                o || i.addEventListener(e, n, !0), Oe.access(i, t, (o || 0) + 1)
            },
            teardown: function() {
                var i = this.ownerDocument || this,
                    o = Oe.access(i, t) - 1;
                o ? Oe.access(i, t, o) : (i.removeEventListener(e, n, !0), Oe.remove(i, t))
            }
        }
    });
    var At = e.location,
        Dt = Date.now(),
        Et = /\?/;
    he.parseXML = function(t) {
        var n;
        if (!t || "string" != typeof t) return null;
        try {
            n = (new e.DOMParser).parseFromString(t, "text/xml")
        } catch (t) {
            n = void 0
        }
        return n && !n.getElementsByTagName("parsererror").length || he.error("Invalid XML: " + t), n
    };
    var jt = /\[\]$/,
        Ot = /\r?\n/g,
        Mt = /^(?:submit|button|image|reset|file)$/i,
        Lt = /^(?:input|select|textarea|keygen)/i;
    he.param = function(e, t) {
        var n, i = [],
            o = function(e, t) {
                var n = de(t) ? t() : t;
                i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
            };
        if (null == e) return "";
        if (Array.isArray(e) || e.jquery && !he.isPlainObject(e)) he.each(e, function() {
            o(this.name, this.value)
        });
        else
            for (n in e) X(n, e[n], t, o);
        return i.join("&")
    }, he.fn.extend({
        serialize: function() {
            return he.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = he.prop(this, "elements");
                return e ? he.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !he(this).is(":disabled") && Lt.test(this.nodeName) && !Mt.test(e) && (this.checked || !Ue.test(e))
            }).map(function(e, t) {
                var n = he(this).val();
                return null == n ? null : Array.isArray(n) ? he.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Ot, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Ot, "\r\n")
                }
            }).get()
        }
    });
    var Pt = /%20/g,
        Nt = /#.*$/,
        It = /([?&])_=[^&]*/,
        Bt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Ht = /^(?:GET|HEAD)$/,
        Rt = /^\/\//,
        qt = {},
        Ft = {},
        zt = "*/".concat("*"),
        Wt = Q.createElement("a");
    Wt.href = At.href, he.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: At.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(At.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": zt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": he.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? K(K(e, he.ajaxSettings), t) : K(he.ajaxSettings, e)
        },
        ajaxPrefilter: Y(qt),
        ajaxTransport: Y(Ft),
        ajax: function(t, n) {
            function i(t, n, i, a) {
                var c, p, f, w, x, C = n;
                d || (d = !0, l && e.clearTimeout(l), o = void 0, s = a || "", $.readyState = 0 < t ? 4 : 0, c = 200 <= t && t < 300 || 304 === t, i && (w = function(e, t, n) {
                    for (var i, o, r, s, a = e.contents, l = e.dataTypes;
                        "*" === l[0];) l.shift(), void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (i)
                        for (o in a)
                            if (a[o] && a[o].test(i)) {
                                l.unshift(o);
                                break
                            }
                    if (l[0] in n) r = l[0];
                    else {
                        for (o in n) {
                            if (!l[0] || e.converters[o + " " + l[0]]) {
                                r = o;
                                break
                            }
                            s || (s = o)
                        }
                        r = r || s
                    }
                    if (r) return r !== l[0] && l.unshift(r), n[r]
                }(h, $, i)), w = function(e, t, n, i) {
                    var o, r, s, a, l, c = {},
                        d = e.dataTypes.slice();
                    if (d[1])
                        for (s in e.converters) c[s.toLowerCase()] = e.converters[s];
                    for (r = d.shift(); r;)
                        if (e.responseFields[r] && (n[e.responseFields[r]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = r, r = d.shift())
                            if ("*" === r) r = l;
                            else if ("*" !== l && l !== r) {
                        if (!(s = c[l + " " + r] || c["* " + r]))
                            for (o in c)
                                if ((a = o.split(" "))[1] === r && (s = c[l + " " + a[0]] || c["* " + a[0]])) {
                                    !0 === s ? s = c[o] : !0 !== c[o] && (r = a[0], d.unshift(a[1]));
                                    break
                                }
                        if (!0 !== s)
                            if (s && e.throws) t = s(t);
                            else try {
                                t = s(t)
                            } catch (e) {
                                return {
                                    state: "parsererror",
                                    error: s ? e : "No conversion from " + l + " to " + r
                                }
                            }
                    }
                    return {
                        state: "success",
                        data: t
                    }
                }(h, w, $, c), c ? (h.ifModified && ((x = $.getResponseHeader("Last-Modified")) && (he.lastModified[r] = x), (x = $.getResponseHeader("etag")) && (he.etag[r] = x)), 204 === t || "HEAD" === h.type ? C = "nocontent" : 304 === t ? C = "notmodified" : (C = w.state, p = w.data, c = !(f = w.error))) : (f = C, !t && C || (C = "error", t < 0 && (t = 0))), $.status = t, $.statusText = (n || C) + "", c ? g.resolveWith(v, [p, C, $]) : g.rejectWith(v, [$, C, f]), $.statusCode(b), b = void 0, u && m.trigger(c ? "ajaxSuccess" : "ajaxError", [$, h, c ? p : f]), y.fireWith(v, [$, C]), u && (m.trigger("ajaxComplete", [$, h]), --he.active || he.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (n = t, t = void 0), n = n || {};
            var o, r, s, a, l, c, d, u, p, f, h = he.ajaxSetup({}, n),
                v = h.context || h,
                m = h.context && (v.nodeType || v.jquery) ? he(v) : he.event,
                g = he.Deferred(),
                y = he.Callbacks("once memory"),
                b = h.statusCode || {},
                w = {},
                x = {},
                C = "canceled",
                $ = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (d) {
                            if (!a)
                                for (a = {}; t = Bt.exec(s);) a[t[1].toLowerCase() + " "] = (a[t[1].toLowerCase() + " "] || []).concat(t[2]);
                            t = a[e.toLowerCase() + " "]
                        }
                        return null == t ? null : t.join(", ")
                    },
                    getAllResponseHeaders: function() {
                        return d ? s : null
                    },
                    setRequestHeader: function(e, t) {
                        return null == d && (e = x[e.toLowerCase()] = x[e.toLowerCase()] || e, w[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return null == d && (h.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (d) $.always(e[$.status]);
                            else
                                for (t in e) b[t] = [b[t], e[t]];
                        return this
                    },
                    abort: function(e) {
                        var t = e || C;
                        return o && o.abort(t), i(0, t), this
                    }
                };
            if (g.promise($), h.url = ((t || h.url || At.href) + "").replace(Rt, At.protocol + "//"), h.type = n.method || n.type || h.method || h.type, h.dataTypes = (h.dataType || "*").toLowerCase().match(Se) || [""], null == h.crossDomain) {
                c = Q.createElement("a");
                try {
                    c.href = h.url, c.href = c.href, h.crossDomain = Wt.protocol + "//" + Wt.host != c.protocol + "//" + c.host
                } catch (t) {
                    h.crossDomain = !0
                }
            }
            if (h.data && h.processData && "string" != typeof h.data && (h.data = he.param(h.data, h.traditional)), J(qt, h, n, $), d) return $;
            for (p in (u = he.event && h.global) && 0 == he.active++ && he.event.trigger("ajaxStart"), h.type = h.type.toUpperCase(), h.hasContent = !Ht.test(h.type), r = h.url.replace(Nt, ""), h.hasContent ? h.data && h.processData && 0 === (h.contentType || "").indexOf("application/x-www-form-urlencoded") && (h.data = h.data.replace(Pt, "+")) : (f = h.url.slice(r.length), h.data && (h.processData || "string" == typeof h.data) && (r += (Et.test(r) ? "&" : "?") + h.data, delete h.data), !1 === h.cache && (r = r.replace(It, "$1"), f = (Et.test(r) ? "&" : "?") + "_=" + Dt++ + f), h.url = r + f), h.ifModified && (he.lastModified[r] && $.setRequestHeader("If-Modified-Since", he.lastModified[r]), he.etag[r] && $.setRequestHeader("If-None-Match", he.etag[r])), (h.data && h.hasContent && !1 !== h.contentType || n.contentType) && $.setRequestHeader("Content-Type", h.contentType), $.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + zt + "; q=0.01" : "") : h.accepts["*"]), h.headers) $.setRequestHeader(p, h.headers[p]);
            if (h.beforeSend && (!1 === h.beforeSend.call(v, $, h) || d)) return $.abort();
            if (C = "abort", y.add(h.complete), $.done(h.success), $.fail(h.error), o = J(Ft, h, n, $)) {
                if ($.readyState = 1, u && m.trigger("ajaxSend", [$, h]), d) return $;
                h.async && 0 < h.timeout && (l = e.setTimeout(function() {
                    $.abort("timeout")
                }, h.timeout));
                try {
                    d = !1, o.send(w, i)
                } catch (t) {
                    if (d) throw t;
                    i(-1, t)
                }
            } else i(-1, "No Transport");
            return $
        },
        getJSON: function(e, t, n) {
            return he.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return he.get(e, void 0, t, "script")
        }
    }), he.each(["get", "post"], function(e, t) {
        he[t] = function(e, n, i, o) {
            return de(n) && (o = o || i, i = n, n = void 0), he.ajax(he.extend({
                url: e,
                type: t,
                dataType: o,
                data: n,
                success: i
            }, he.isPlainObject(e) && e))
        }
    }), he._evalUrl = function(e, t) {
        return he.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(e) {
                he.globalEval(e, t)
            }
        })
    }, he.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (de(e) && (e = e.call(this[0])), t = he(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                return e
            }).append(this)), this
        },
        wrapInner: function(e) {
            return de(e) ? this.each(function(t) {
                he(this).wrapInner(e.call(this, t))
            }) : this.each(function() {
                var t = he(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = de(e);
            return this.each(function(n) {
                he(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                he(this).replaceWith(this.childNodes)
            }), this
        }
    }), he.expr.pseudos.hidden = function(e) {
        return !he.expr.pseudos.visible(e)
    }, he.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }, he.ajaxSettings.xhr = function() {
        try {
            return new e.XMLHttpRequest
        } catch (e) {}
    };
    var Ut = {
            0: 200,
            1223: 204
        },
        Vt = he.ajaxSettings.xhr();
    ce.cors = !!Vt && "withCredentials" in Vt, ce.ajax = Vt = !!Vt, he.ajaxTransport(function(t) {
        var n, i;
        if (ce.cors || Vt && !t.crossDomain) return {
            send: function(o, r) {
                var s, a = t.xhr();
                if (a.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                    for (s in t.xhrFields) a[s] = t.xhrFields[s];
                for (s in t.mimeType && a.overrideMimeType && a.overrideMimeType(t.mimeType), t.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest"), o) a.setRequestHeader(s, o[s]);
                n = function(e) {
                    return function() {
                        n && (n = i = a.onload = a.onerror = a.onabort = a.ontimeout = a.onreadystatechange = null, "abort" === e ? a.abort() : "error" === e ? "number" != typeof a.status ? r(0, "error") : r(a.status, a.statusText) : r(Ut[a.status] || a.status, a.statusText, "text" !== (a.responseType || "text") || "string" != typeof a.responseText ? {
                            binary: a.response
                        } : {
                            text: a.responseText
                        }, a.getAllResponseHeaders()))
                    }
                }, a.onload = n(), i = a.onerror = a.ontimeout = n("error"), void 0 !== a.onabort ? a.onabort = i : a.onreadystatechange = function() {
                    4 === a.readyState && e.setTimeout(function() {
                        n && i()
                    })
                }, n = n("abort");
                try {
                    a.send(t.hasContent && t.data || null)
                } catch (o) {
                    if (n) throw o
                }
            },
            abort: function() {
                n && n()
            }
        }
    }), he.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }), he.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return he.globalEval(e), e
            }
        }
    }), he.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
    }), he.ajaxTransport("script", function(e) {
        var t, n;
        if (e.crossDomain || e.scriptAttrs) return {
            send: function(i, o) {
                t = he("<script>").attr(e.scriptAttrs || {}).prop({
                    charset: e.scriptCharset,
                    src: e.url
                }).on("load error", n = function(e) {
                    t.remove(), n = null, e && o("error" === e.type ? 404 : 200, e.type)
                }), Q.head.appendChild(t[0])
            },
            abort: function() {
                n && n()
            }
        }
    });
    var Xt, Yt = [],
        Jt = /(=)\?(?=&|$)|\?\?/;
    he.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Yt.pop() || he.expando + "_" + Dt++;
            return this[e] = !0, e
        }
    }), he.ajaxPrefilter("json jsonp", function(t, n, i) {
        var o, r, s, a = !1 !== t.jsonp && (Jt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Jt.test(t.data) && "data");
        if (a || "jsonp" === t.dataTypes[0]) return o = t.jsonpCallback = de(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(Jt, "$1" + o) : !1 !== t.jsonp && (t.url += (Et.test(t.url) ? "&" : "?") + t.jsonp + "=" + o), t.converters["script json"] = function() {
            return s || he.error(o + " was not called"), s[0]
        }, t.dataTypes[0] = "json", r = e[o], e[o] = function() {
            s = arguments
        }, i.always(function() {
            void 0 === r ? he(e).removeProp(o) : e[o] = r, t[o] && (t.jsonpCallback = n.jsonpCallback, Yt.push(o)), s && de(r) && r(s[0]), s = r = void 0
        }), "script"
    }), ce.createHTMLDocument = ((Xt = Q.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === Xt.childNodes.length), he.parseHTML = function(e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = !1), t || (ce.createHTMLDocument ? ((i = (t = Q.implementation.createHTMLDocument("")).createElement("base")).href = Q.location.href, t.head.appendChild(i)) : t = Q), r = !n && [], (o = we.exec(e)) ? [t.createElement(o[1])] : (o = w([e], t, r), r && r.length && he(r).remove(), he.merge([], o.childNodes)));
        var i, o, r
    }, he.fn.load = function(e, t, n) {
        var i, o, r, s = this,
            a = e.indexOf(" ");
        return -1 < a && (i = W(e.slice(a)), e = e.slice(0, a)), de(t) ? (n = t, t = void 0) : t && "object" == typeof t && (o = "POST"), 0 < s.length && he.ajax({
            url: e,
            type: o || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            r = arguments, s.html(i ? he("<div>").append(he.parseHTML(e)).find(i) : e)
        }).always(n && function(e, t) {
            s.each(function() {
                n.apply(this, r || [e.responseText, t, e])
            })
        }), this
    }, he.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        he.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), he.expr.pseudos.animated = function(e) {
        return he.grep(he.timers, function(t) {
            return e === t.elem
        }).length
    }, he.offset = {
        setOffset: function(e, t, n) {
            var i, o, r, s, a, l, c = he.css(e, "position"),
                d = he(e),
                u = {};
            "static" === c && (e.style.position = "relative"), a = d.offset(), r = he.css(e, "top"), l = he.css(e, "left"), ("absolute" === c || "fixed" === c) && -1 < (r + l).indexOf("auto") ? (s = (i = d.position()).top, o = i.left) : (s = parseFloat(r) || 0, o = parseFloat(l) || 0), de(t) && (t = t.call(e, n, he.extend({}, a))), null != t.top && (u.top = t.top - a.top + s), null != t.left && (u.left = t.left - a.left + o), "using" in t ? t.using.call(e, u) : d.css(u)
        }
    }, he.fn.extend({
        offset: function(e) {
            if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                he.offset.setOffset(this, e, t)
            });
            var t, n, i = this[0];
            return i ? i.getClientRects().length ? (t = i.getBoundingClientRect(), n = i.ownerDocument.defaultView, {
                top: t.top + n.pageYOffset,
                left: t.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n, i = this[0],
                    o = {
                        top: 0,
                        left: 0
                    };
                if ("fixed" === he.css(i, "position")) t = i.getBoundingClientRect();
                else {
                    for (t = this.offset(), n = i.ownerDocument, e = i.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === he.css(e, "position");) e = e.parentNode;
                    e && e !== i && 1 === e.nodeType && ((o = he(e).offset()).top += he.css(e, "borderTopWidth", !0), o.left += he.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - o.top - he.css(i, "marginTop", !0),
                    left: t.left - o.left - he.css(i, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent; e && "static" === he.css(e, "position");) e = e.offsetParent;
                return e || He
            })
        }
    }), he.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = "pageYOffset" === t;
        he.fn[e] = function(i) {
            return Ae(this, function(e, i, o) {
                var r;
                if (ue(e) ? r = e : 9 === e.nodeType && (r = e.defaultView), void 0 === o) return r ? r[t] : e[i];
                r ? r.scrollTo(n ? r.pageXOffset : o, n ? o : r.pageYOffset) : e[i] = o
            }, e, i, arguments.length)
        }
    }), he.each(["top", "left"], function(e, t) {
        he.cssHooks[t] = M(ce.pixelPosition, function(e, n) {
            if (n) return n = O(e, t), rt.test(n) ? he(e).position()[t] + "px" : n
        })
    }), he.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        he.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, i) {
            he.fn[i] = function(o, r) {
                var s = arguments.length && (n || "boolean" != typeof o),
                    a = n || (!0 === o || !0 === r ? "margin" : "border");
                return Ae(this, function(t, n, o) {
                    var r;
                    return ue(t) ? 0 === i.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (r = t.documentElement, Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e])) : void 0 === o ? he.css(t, n, a) : he.style(t, n, o, a)
                }, t, s ? o : void 0, s)
            }
        })
    }), he.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, t) {
        he.fn[t] = function(e, n) {
            return 0 < arguments.length ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), he.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }), he.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }), he.proxy = function(e, t) {
        var n, i, o;
        if ("string" == typeof t && (n = e[t], t = e, e = n), de(e)) return i = ee.call(arguments, 2), (o = function() {
            return e.apply(t || this, i.concat(ee.call(arguments)))
        }).guid = e.guid = e.guid || he.guid++, o
    }, he.holdReady = function(e) {
        e ? he.readyWait++ : he.ready(!0)
    }, he.isArray = Array.isArray, he.parseJSON = JSON.parse, he.nodeName = r, he.isFunction = de, he.isWindow = ue, he.camelCase = f, he.type = i, he.now = Date.now, he.isNumeric = function(e) {
        var t = he.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }, "function" == typeof define && define.amd && define("jquery", [], function() {
        return he
    });
    var Kt = e.jQuery,
        Gt = e.$;
    return he.noConflict = function(t) {
        return e.$ === he && (e.$ = Gt), t && e.jQuery === he && (e.jQuery = Kt), he
    }, t || (e.jQuery = e.$ = he), he
}),
function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Vue = t()
}(this, function() {
    "use strict";

    function e(e) {
        return null == e
    }

    function t(e) {
        return null != e
    }

    function n(e) {
        return !0 === e
    }

    function i(e) {
        return "string" == typeof e || "number" == typeof e || "symbol" == typeof e || "boolean" == typeof e
    }

    function o(e) {
        return null !== e && "object" == typeof e
    }

    function r(e) {
        return "[object Object]" === Mn.call(e)
    }

    function s(e) {
        var t = parseFloat(String(e));
        return 0 <= t && Math.floor(t) === t && isFinite(e)
    }

    function a(e) {
        return null == e ? "" : "object" == typeof e ? JSON.stringify(e, null, 2) : String(e)
    }

    function l(e) {
        var t = parseFloat(e);
        return isNaN(t) ? e : t
    }

    function c(e, t) {
        for (var n = Object.create(null), i = e.split(","), o = 0; o < i.length; o++) n[i[o]] = !0;
        return t ? function(e) {
            return n[e.toLowerCase()]
        } : function(e) {
            return n[e]
        }
    }

    function d(e, t) {
        if (e.length) {
            var n = e.indexOf(t);
            if (-1 < n) return e.splice(n, 1)
        }
    }

    function u(e, t) {
        return Nn.call(e, t)
    }

    function p(e) {
        var t = Object.create(null);
        return function(n) {
            return t[n] || (t[n] = e(n))
        }
    }

    function f(e, t) {
        t = t || 0;
        for (var n = e.length - t, i = new Array(n); n--;) i[n] = e[n + t];
        return i
    }

    function h(e, t) {
        for (var n in t) e[n] = t[n];
        return e
    }

    function v(e) {
        for (var t = {}, n = 0; n < e.length; n++) e[n] && h(t, e[n]);
        return t
    }

    function m(e, t, n) {}

    function g(e, t) {
        if (e === t) return !0;
        var n = o(e),
            i = o(t);
        if (!n || !i) return !n && !i && String(e) === String(t);
        try {
            var r = Array.isArray(e),
                s = Array.isArray(t);
            if (r && s) return e.length === t.length && e.every(function(e, n) {
                return g(e, t[n])
            });
            if (r || s) return !1;
            var a = Object.keys(e),
                l = Object.keys(t);
            return a.length === l.length && a.every(function(n) {
                return g(e[n], t[n])
            })
        } catch (n) {
            return !1
        }
    }

    function y(e, t) {
        for (var n = 0; n < e.length; n++)
            if (g(e[n], t)) return n;
        return -1
    }

    function b(e) {
        var t = !1;
        return function() {
            t || (t = !0, e.apply(this, arguments))
        }
    }

    function w(e, t, n, i) {
        Object.defineProperty(e, t, {
            value: n,
            enumerable: !!i,
            writable: !0,
            configurable: !0
        })
    }

    function x(e) {
        return "function" == typeof e && /native code/.test(e.toString())
    }

    function C(e) {
        hi.target && vi.push(hi.target), hi.target = e
    }

    function $() {
        hi.target = vi.pop()
    }

    function k(e) {
        return new mi(void 0, void 0, void 0, String(e))
    }

    function S(e) {
        var t = new mi(e.tag, e.data, e.children, e.text, e.elm, e.context, e.componentOptions, e.asyncFactory);
        return t.ns = e.ns, t.isStatic = e.isStatic, t.key = e.key, t.isComment = e.isComment, t.fnContext = e.fnContext, t.fnOptions = e.fnOptions, t.fnScopeId = e.fnScopeId, t.isCloned = !0, t
    }

    function _(e) {
        Ci = e
    }

    function T(e, t, n) {
        e.__proto__ = t
    }

    function A(e, t, n) {
        for (var i = 0, o = n.length; i < o; i++) {
            var r = n[i];
            w(e, r, t[r])
        }
    }

    function D(e, t) {
        var n;
        if (o(e) && !(e instanceof mi)) return u(e, "__ob__") && e.__ob__ instanceof $i ? n = e.__ob__ : Ci && !ci() && (Array.isArray(e) || r(e)) && Object.isExtensible(e) && !e._isVue && (n = new $i(e)), t && n && n.vmCount++, n
    }

    function E(e, t, n, i, o) {
        var r = new hi,
            s = Object.getOwnPropertyDescriptor(e, t);
        if (!s || !1 !== s.configurable) {
            var a = s && s.get;
            a || 2 !== arguments.length || (n = e[t]);
            var l = s && s.set,
                c = !o && D(n);
            Object.defineProperty(e, t, {
                enumerable: !0,
                configurable: !0,
                get: function() {
                    var t = a ? a.call(e) : n;
                    return hi.target && (r.depend(), c && (c.dep.depend(), Array.isArray(t) && function e(t) {
                        for (var n = void 0, i = 0, o = t.length; i < o; i++)(n = t[i]) && n.__ob__ && n.__ob__.dep.depend(), Array.isArray(n) && e(n)
                    }(t))), t
                },
                set: function(t) {
                    var i = a ? a.call(e) : n;
                    t === i || t != t && i != i || (l ? l.call(e, t) : n = t, c = !o && D(t), r.notify())
                }
            })
        }
    }

    function j(e, t, n) {
        if (Array.isArray(e) && s(t)) return e.length = Math.max(e.length, t), e.splice(t, 1, n), n;
        if (t in e && !(t in Object.prototype)) return e[t] = n;
        var i = e.__ob__;
        return e._isVue || i && i.vmCount ? n : i ? (E(i.value, t, n), i.dep.notify(), n) : e[t] = n
    }

    function O(e, t) {
        if (Array.isArray(e) && s(t)) e.splice(t, 1);
        else {
            var n = e.__ob__;
            e._isVue || n && n.vmCount || u(e, t) && (delete e[t], n && n.dep.notify())
        }
    }

    function M(e, t) {
        if (!t) return e;
        for (var n, i, o, s = Object.keys(t), a = 0; a < s.length; a++) i = e[n = s[a]], o = t[n], u(e, n) ? r(i) && r(o) && M(i, o) : j(e, n, o);
        return e
    }

    function L(e, t, n) {
        return n ? function() {
            var i = "function" == typeof t ? t.call(n, n) : t,
                o = "function" == typeof e ? e.call(n, n) : e;
            return i ? M(i, o) : o
        } : t ? e ? function() {
            return M("function" == typeof t ? t.call(this, this) : t, "function" == typeof e ? e.call(this, this) : e)
        } : t : e
    }

    function P(e, t) {
        return t ? e ? e.concat(t) : Array.isArray(t) ? t : [t] : e
    }

    function N(e, t, n, i) {
        var o = Object.create(e || null);
        return t ? h(o, t) : o
    }

    function I(e, t, n) {
        function i(i) {
            var o = ki[i] || Ti;
            c[i] = o(e[i], t[i], n, i)
        }
        "function" == typeof t && (t = t.options),
            function(e, t) {
                var n = e.props;
                if (n) {
                    var i, o, s = {};
                    if (Array.isArray(n))
                        for (i = n.length; i--;) "string" == typeof(o = n[i]) && (s[Bn(o)] = {
                            type: null
                        });
                    else if (r(n))
                        for (var a in n) o = n[a], s[Bn(a)] = r(o) ? o : {
                            type: o
                        };
                    e.props = s
                }
            }(t),
            function(e, t) {
                var n = e.inject;
                if (n) {
                    var i = e.inject = {};
                    if (Array.isArray(n))
                        for (var o = 0; o < n.length; o++) i[n[o]] = {
                            from: n[o]
                        };
                    else if (r(n))
                        for (var s in n) {
                            var a = n[s];
                            i[s] = r(a) ? h({
                                from: s
                            }, a) : {
                                from: a
                            }
                        }
                }
            }(t),
            function(e) {
                var t = e.directives;
                if (t)
                    for (var n in t) {
                        var i = t[n];
                        "function" == typeof i && (t[n] = {
                            bind: i,
                            update: i
                        })
                    }
            }(t);
        var o = t.extends;
        if (o && (e = I(e, o, n)), t.mixins)
            for (var s = 0, a = t.mixins.length; s < a; s++) e = I(e, t.mixins[s], n);
        var l, c = {};
        for (l in e) i(l);
        for (l in t) u(e, l) || i(l);
        return c
    }

    function B(e, t, n, i) {
        if ("string" == typeof n) {
            var o = e[t];
            if (u(o, n)) return o[n];
            var r = Bn(n);
            if (u(o, r)) return o[r];
            var s = Hn(r);
            return u(o, s) ? o[s] : o[n] || o[r] || o[s]
        }
    }

    function H(e, t, n, i) {
        var o = t[e],
            r = !u(n, e),
            s = n[e],
            a = F(Boolean, o.type);
        if (-1 < a)
            if (r && !u(o, "default")) s = !1;
            else if ("" === s || s === qn(e)) {
            var l = F(String, o.type);
            (l < 0 || a < l) && (s = !0)
        }
        if (void 0 === s) {
            s = function(e, t, n) {
                if (u(t, "default")) {
                    var i = t.default;
                    return e && e.$options.propsData && void 0 === e.$options.propsData[n] && void 0 !== e._props[n] ? e._props[n] : "function" == typeof i && "Function" !== R(t.type) ? i.call(e) : i
                }
            }(i, o, e);
            var c = Ci;
            _(!0), D(s), _(c)
        }
        return s
    }

    function R(e) {
        var t = e && e.toString().match(/^\s*function (\w+)/);
        return t ? t[1] : ""
    }

    function q(e, t) {
        return R(e) === R(t)
    }

    function F(e, t) {
        if (!Array.isArray(t)) return q(t, e) ? 0 : -1;
        for (var n = 0, i = t.length; n < i; n++)
            if (q(t[n], e)) return n;
        return -1
    }

    function z(e, t, n) {
        if (t)
            for (var i = t; i = i.$parent;) {
                var o = i.$options.errorCaptured;
                if (o)
                    for (var r = 0; r < o.length; r++) try {
                        if (!1 === o[r].call(i, e, t, n)) return
                    } catch (e) {
                        W(e, i, "errorCaptured hook")
                    }
            }
        W(e, t, n)
    }

    function W(e, t, n) {
        if (Yn.errorHandler) try {
            return Yn.errorHandler.call(null, e, t, n)
        } catch (e) {
            U(e, null, "config.errorHandler")
        }
        U(e, t, n)
    }

    function U(e, t, n) {
        if (!Gn && !Qn || "undefined" == typeof console) throw e;
        console.error(e)
    }

    function V() {
        Di = !1;
        for (var e = Ai.slice(0), t = Ai.length = 0; t < e.length; t++) e[t]()
    }

    function X(e, t) {
        var n;
        if (Ai.push(function() {
                if (e) try {
                    e.call(t)
                } catch (e) {
                    z(e, t, "nextTick")
                } else n && n(t)
            }), Di || (Di = !0, Ei ? _i() : Si()), !e && "undefined" != typeof Promise) return new Promise(function(e) {
            n = e
        })
    }

    function Y(e) {
        ! function e(t, n) {
            var i, r, s = Array.isArray(t);
            if (!(!s && !o(t) || Object.isFrozen(t) || t instanceof mi)) {
                if (t.__ob__) {
                    var a = t.__ob__.dep.id;
                    if (n.has(a)) return;
                    n.add(a)
                }
                if (s)
                    for (i = t.length; i--;) e(t[i], n);
                else
                    for (r = Object.keys(t), i = r.length; i--;) e(t[r[i]], n)
            }
        }(e, Pi), Pi.clear()
    }

    function J(e) {
        function t() {
            var e = arguments,
                n = t.fns;
            if (!Array.isArray(n)) return n.apply(null, arguments);
            for (var i = n.slice(), o = 0; o < i.length; o++) i[o].apply(null, e)
        }
        return t.fns = e, t
    }

    function K(t, n, i, o, r) {
        var s, a, l, c;
        for (s in t) a = t[s], l = n[s], c = Ni(s), e(a) || (e(l) ? (e(a.fns) && (a = t[s] = J(a)), i(c.name, a, c.once, c.capture, c.passive, c.params)) : a !== l && (l.fns = a, t[s] = l));
        for (s in n) e(t[s]) && o((c = Ni(s)).name, n[s], c.capture)
    }

    function G(i, o, r) {
        function s() {
            r.apply(this, arguments), d(a.fns, s)
        }
        var a;
        i instanceof mi && (i = i.data.hook || (i.data.hook = {}));
        var l = i[o];
        e(l) ? a = J([s]) : t(l.fns) && n(l.merged) ? (a = l).fns.push(s) : a = J([l, s]), a.merged = !0, i[o] = a
    }

    function Q(e, n, i, o, r) {
        if (t(n)) {
            if (u(n, i)) return e[i] = n[i], r || delete n[i], !0;
            if (u(n, o)) return e[i] = n[o], r || delete n[o], !0
        }
        return !1
    }

    function Z(o) {
        return i(o) ? [k(o)] : Array.isArray(o) ? function o(r, s) {
            var a, l, c, d, u = [];
            for (a = 0; a < r.length; a++) e(l = r[a]) || "boolean" == typeof l || (c = u.length - 1, d = u[c], Array.isArray(l) ? 0 < l.length && (ee((l = o(l, (s || "") + "_" + a))[0]) && ee(d) && (u[c] = k(d.text + l[0].text), l.shift()), u.push.apply(u, l)) : i(l) ? ee(d) ? u[c] = k(d.text + l) : "" !== l && u.push(k(l)) : ee(l) && ee(d) ? u[c] = k(d.text + l.text) : (n(r._isVList) && t(l.tag) && e(l.key) && t(s) && (l.key = "__vlist" + s + "_" + a + "__"), u.push(l)));
            return u
        }(o) : void 0
    }

    function ee(e) {
        return t(e) && t(e.text) && !1 === e.isComment
    }

    function te(e, t) {
        return (e.__esModule || ui && "Module" === e[Symbol.toStringTag]) && (e = e.default), o(e) ? t.extend(e) : e
    }

    function ne(e) {
        return e.isComment && e.asyncFactory
    }

    function ie(e) {
        if (Array.isArray(e))
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                if (t(i) && (t(i.componentOptions) || ne(i))) return i
            }
    }

    function oe(e, t, n) {
        n ? Li.$once(e, t) : Li.$on(e, t)
    }

    function re(e, t) {
        Li.$off(e, t)
    }

    function se(e, t, n) {
        Li = e, K(t, n || {}, oe, re), Li = void 0
    }

    function ae(e, t) {
        var n = {};
        if (!e) return n;
        for (var i = 0, o = e.length; i < o; i++) {
            var r = e[i],
                s = r.data;
            if (s && s.attrs && s.attrs.slot && delete s.attrs.slot, r.context !== t && r.fnContext !== t || !s || null == s.slot)(n.default || (n.default = [])).push(r);
            else {
                var a = s.slot,
                    l = n[a] || (n[a] = []);
                "template" === r.tag ? l.push.apply(l, r.children || []) : l.push(r)
            }
        }
        for (var c in n) n[c].every(le) && delete n[c];
        return n
    }

    function le(e) {
        return e.isComment && !e.asyncFactory || " " === e.text
    }

    function ce(e, t) {
        t = t || {};
        for (var n = 0; n < e.length; n++) Array.isArray(e[n]) ? ce(e[n], t) : t[e[n].key] = e[n].fn;
        return t
    }

    function de(e) {
        for (; e && (e = e.$parent);)
            if (e._inactive) return !0;
        return !1
    }

    function ue(e, t) {
        if (t) {
            if (e._directInactive = !1, de(e)) return
        } else if (e._directInactive) return;
        if (e._inactive || null === e._inactive) {
            e._inactive = !1;
            for (var n = 0; n < e.$children.length; n++) ue(e.$children[n]);
            pe(e, "activated")
        }
    }

    function pe(e, t) {
        C();
        var n = e.$options[t];
        if (n)
            for (var i = 0, o = n.length; i < o; i++) try {
                n[i].call(e)
            } catch (n) {
                z(n, e, t + " hook")
            }
        e._hasHookEvent && e.$emit("hook:" + t), $()
    }

    function fe() {
        var e, t;
        for (Fi = !0, Bi.sort(function(e, t) {
                return e.id - t.id
            }), zi = 0; zi < Bi.length; zi++) t = (e = Bi[zi]).id, Ri[t] = null, e.run();
        var n = Hi.slice(),
            i = Bi.slice();
        zi = Bi.length = Hi.length = 0, Ri = {}, qi = Fi = !1,
            function(e) {
                for (var t = 0; t < e.length; t++) e[t]._inactive = !0, ue(e[t], !0)
            }(n),
            function(e) {
                for (var t = e.length; t--;) {
                    var n = e[t],
                        i = n.vm;
                    i._watcher === n && i._isMounted && pe(i, "updated")
                }
            }(i), di && Yn.devtools && di.emit("flush")
    }

    function he(e, t, n) {
        Vi.get = function() {
            return this[t][n]
        }, Vi.set = function(e) {
            this[t][n] = e
        }, Object.defineProperty(e, n, Vi)
    }

    function ve(e) {
        e._watchers = [];
        var t = e.$options;
        t.props && function(e, t) {
            var n = e.$options.propsData || {},
                i = e._props = {},
                o = e.$options._propKeys = [];
            e.$parent && _(!1);
            for (var r in t) ! function(r) {
                o.push(r);
                var s = H(r, t, n, e);
                E(i, r, s), r in e || he(e, "_props", r)
            }(r);
            _(!0)
        }(e, t.props), t.methods && function(e, t) {
            e.$options.props;
            for (var n in t) e[n] = null == t[n] ? m : Fn(t[n], e)
        }(e, t.methods), t.data ? function(e) {
            var t = e.$options.data;
            r(t = e._data = "function" == typeof t ? function(e, t) {
                C();
                try {
                    return e.call(t, t)
                } catch (e) {
                    return z(e, t, "data()"), {}
                } finally {
                    $()
                }
            }(t, e) : t || {}) || (t = {});
            for (var n = Object.keys(t), i = e.$options.props, o = (e.$options.methods, n.length); o--;) {
                var s = n[o];
                i && u(i, s) || 36 !== (a = (s + "").charCodeAt(0)) && 95 !== a && he(e, "_data", s)
            }
            var a;
            D(t, !0)
        }(e) : D(e._data = {}, !0), t.computed && function(e, t) {
            var n = e._computedWatchers = Object.create(null),
                i = ci();
            for (var o in t) {
                var r = t[o],
                    s = "function" == typeof r ? r : r.get;
                i || (n[o] = new Ui(e, s || m, m, Xi)), o in e || me(e, o, r)
            }
        }(e, t.computed), t.watch && t.watch !== ri && function(e, t) {
            for (var n in t) {
                var i = t[n];
                if (Array.isArray(i))
                    for (var o = 0; o < i.length; o++) ye(e, n, i[o]);
                else ye(e, n, i)
            }
        }(e, t.watch)
    }

    function me(e, t, n) {
        var i = !ci();
        "function" == typeof n ? (Vi.get = i ? ge(t) : n, Vi.set = m) : (Vi.get = n.get ? i && !1 !== n.cache ? ge(t) : n.get : m, Vi.set = n.set ? n.set : m), Object.defineProperty(e, t, Vi)
    }

    function ge(e) {
        return function() {
            var t = this._computedWatchers && this._computedWatchers[e];
            if (t) return t.dirty && t.evaluate(), hi.target && t.depend(), t.value
        }
    }

    function ye(e, t, n, i) {
        return r(n) && (n = (i = n).handler), "string" == typeof n && (n = e[n]), e.$watch(t, n, i)
    }

    function be(e, t) {
        if (e) {
            for (var n = Object.create(null), i = ui ? Reflect.ownKeys(e).filter(function(t) {
                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                }) : Object.keys(e), o = 0; o < i.length; o++) {
                for (var r = i[o], s = e[r].from, a = t; a;) {
                    if (a._provided && u(a._provided, s)) {
                        n[r] = a._provided[s];
                        break
                    }
                    a = a.$parent
                }
                if (!a && "default" in e[r]) {
                    var l = e[r].default;
                    n[r] = "function" == typeof l ? l.call(t) : l
                }
            }
            return n
        }
    }

    function we(e, n) {
        var i, r, s, a, l;
        if (Array.isArray(e) || "string" == typeof e)
            for (i = new Array(e.length), r = 0, s = e.length; r < s; r++) i[r] = n(e[r], r);
        else if ("number" == typeof e)
            for (i = new Array(e), r = 0; r < e; r++) i[r] = n(r + 1, r);
        else if (o(e))
            for (a = Object.keys(e), i = new Array(a.length), r = 0, s = a.length; r < s; r++) l = a[r], i[r] = n(e[l], l, r);
        return t(i) && (i._isVList = !0), i
    }

    function xe(e, t, n, i) {
        var o, r = this.$scopedSlots[e];
        if (r) n = n || {}, i && (n = h(h({}, i), n)), o = r(n) || t;
        else {
            var s = this.$slots[e];
            s && (s._rendered = !0), o = s || t
        }
        var a = n && n.slot;
        return a ? this.$createElement("template", {
            slot: a
        }, o) : o
    }

    function Ce(e) {
        return B(this.$options, "filters", e) || Wn
    }

    function $e(e, t) {
        return Array.isArray(e) ? -1 === e.indexOf(t) : e !== t
    }

    function ke(e, t, n, i, o) {
        var r = Yn.keyCodes[t] || n;
        return o && i && !Yn.keyCodes[t] ? $e(o, i) : r ? $e(r, e) : i ? qn(i) !== t : void 0
    }

    function Se(e, t, n, i, r) {
        if (n && o(n)) {
            var s;
            Array.isArray(n) && (n = v(n));
            for (var a in n) ! function(o) {
                if ("class" === o || "style" === o || Pn(o)) s = e;
                else {
                    var a = e.attrs && e.attrs.type;
                    s = i || Yn.mustUseProp(t, a, o) ? e.domProps || (e.domProps = {}) : e.attrs || (e.attrs = {})
                }
                o in s || (s[o] = n[o], r && ((e.on || (e.on = {}))["update:" + o] = function(e) {
                    n[o] = e
                }))
            }(a)
        }
        return e
    }

    function _e(e, t) {
        var n = this._staticTrees || (this._staticTrees = []),
            i = n[e];
        return i && !t || Ae(i = n[e] = this.$options.staticRenderFns[e].call(this._renderProxy, null, this), "__static__" + e, !1), i
    }

    function Te(e, t, n) {
        return Ae(e, "__once__" + t + (n ? "_" + n : ""), !0), e
    }

    function Ae(e, t, n) {
        if (Array.isArray(e))
            for (var i = 0; i < e.length; i++) e[i] && "string" != typeof e[i] && De(e[i], t + "_" + i, n);
        else De(e, t, n)
    }

    function De(e, t, n) {
        e.isStatic = !0, e.key = t, e.isOnce = n
    }

    function Ee(e, t) {
        if (t && r(t)) {
            var n = e.on = e.on ? h({}, e.on) : {};
            for (var i in t) {
                var o = n[i],
                    s = t[i];
                n[i] = o ? [].concat(o, s) : s
            }
        }
        return e
    }

    function je(e) {
        e._o = Te, e._n = l, e._s = a, e._l = we, e._t = xe, e._q = g, e._i = y, e._m = _e, e._f = Ce, e._k = ke, e._b = Se, e._v = k, e._e = yi, e._u = ce, e._g = Ee
    }

    function Oe(e, t, i, o, r) {
        var s, a = r.options;
        u(o, "_uid") ? (s = Object.create(o))._original = o : o = (s = o)._original;
        var l = n(a._compiled),
            c = !l;
        this.data = e, this.props = t, this.children = i, this.parent = o, this.listeners = e.on || On, this.injections = be(a.inject, o), this.slots = function() {
            return ae(i, o)
        }, l && (this.$options = a, this.$slots = this.slots(), this.$scopedSlots = e.scopedSlots || On), a._scopeId ? this._c = function(e, t, n, i) {
            var r = Ne(s, e, t, n, i, c);
            return r && !Array.isArray(r) && (r.fnScopeId = a._scopeId, r.fnContext = o), r
        } : this._c = function(e, t, n, i) {
            return Ne(s, e, t, n, i, c)
        }
    }

    function Me(e, t, n, i) {
        var o = S(e);
        return o.fnContext = n, o.fnOptions = i, t.slot && ((o.data || (o.data = {})).slot = t.slot), o
    }

    function Le(e, t) {
        for (var n in t) e[Bn(n)] = t[n]
    }

    function Pe(i, r, s, a, l) {
        if (!e(i)) {
            var c = s.$options._base;
            if (o(i) && (i = c.extend(i)), "function" == typeof i) {
                var d, u, p, f, h, v, m;
                if (e(i.cid) && void 0 === (i = function(i, r, s) {
                        if (n(i.error) && t(i.errorComp)) return i.errorComp;
                        if (t(i.resolved)) return i.resolved;
                        if (n(i.loading) && t(i.loadingComp)) return i.loadingComp;
                        if (!t(i.contexts)) {
                            var a = i.contexts = [s],
                                l = !0,
                                c = function() {
                                    for (var e = 0, t = a.length; e < t; e++) a[e].$forceUpdate()
                                },
                                d = b(function(e) {
                                    i.resolved = te(e, r), l || c()
                                }),
                                u = b(function(e) {
                                    t(i.errorComp) && (i.error = !0, c())
                                }),
                                p = i(d, u);
                            return o(p) && ("function" == typeof p.then ? e(i.resolved) && p.then(d, u) : t(p.component) && "function" == typeof p.component.then && (p.component.then(d, u), t(p.error) && (i.errorComp = te(p.error, r)), t(p.loading) && (i.loadingComp = te(p.loading, r), 0 === p.delay ? i.loading = !0 : setTimeout(function() {
                                e(i.resolved) && e(i.error) && (i.loading = !0, c())
                            }, p.delay || 200)), t(p.timeout) && setTimeout(function() {
                                e(i.resolved) && u(null)
                            }, p.timeout))), l = !1, i.loading ? i.loadingComp : i.resolved
                        }
                        i.contexts.push(s)
                    }(d = i, c, s))) return u = d, p = r, f = s, h = a, v = l, (m = yi()).asyncFactory = u, m.asyncMeta = {
                    data: p,
                    context: f,
                    children: h,
                    tag: v
                }, m;
                r = r || {}, Ie(i), t(r.model) && function(e, n) {
                    var i = e.model && e.model.prop || "value",
                        o = e.model && e.model.event || "input";
                    (n.props || (n.props = {}))[i] = n.model.value;
                    var r = n.on || (n.on = {});
                    t(r[o]) ? r[o] = [n.model.callback].concat(r[o]) : r[o] = n.model.callback
                }(i.options, r);
                var g = function(n, i, o) {
                    var r = i.options.props;
                    if (!e(r)) {
                        var s = {},
                            a = n.attrs,
                            l = n.props;
                        if (t(a) || t(l))
                            for (var c in r) {
                                var d = qn(c);
                                Q(s, l, c, d, !0) || Q(s, a, c, d, !1)
                            }
                        return s
                    }
                }(r, i);
                if (n(i.options.functional)) return function(e, n, i, o, r) {
                    var s = e.options,
                        a = {},
                        l = s.props;
                    if (t(l))
                        for (var c in l) a[c] = H(c, l, n || On);
                    else t(i.attrs) && Le(a, i.attrs), t(i.props) && Le(a, i.props);
                    var d = new Oe(i, a, r, o, e),
                        u = s.render.call(null, d._c, d);
                    if (u instanceof mi) return Me(u, i, d.parent, s);
                    if (Array.isArray(u)) {
                        for (var p = Z(u) || [], f = new Array(p.length), h = 0; h < p.length; h++) f[h] = Me(p[h], i, d.parent, s);
                        return f
                    }
                }(i, g, r, s, a);
                var y = r.on;
                if (r.on = r.nativeOn, n(i.options.abstract)) {
                    var w = r.slot;
                    r = {}, w && (r.slot = w)
                }! function(e) {
                    for (var t = e.hook || (e.hook = {}), n = 0; n < no.length; n++) {
                        var i = no[n];
                        t[i] = to[i]
                    }
                }(r);
                var x = i.options.name || l;
                return new mi("vue-component-" + i.cid + (x ? "-" + x : ""), r, void 0, void 0, void 0, s, {
                    Ctor: i,
                    propsData: g,
                    listeners: y,
                    tag: l,
                    children: a
                }, d)
            }
        }
    }

    function Ne(r, s, a, l, c, d) {
        return (Array.isArray(a) || i(a)) && (c = l, l = a, a = void 0), n(d) && (c = oo),
            function(i, r, s, a, l) {
                if (t(s) && t(s.__ob__)) return yi();
                if (t(s) && t(s.is) && (r = s.is), !r) return yi();
                Array.isArray(a) && "function" == typeof a[0] && ((s = s || {}).scopedSlots = {
                    default: a[0]
                }, a.length = 0), l === oo ? a = Z(a) : l === io && (a = function(e) {
                    for (var t = 0; t < e.length; t++)
                        if (Array.isArray(e[t])) return Array.prototype.concat.apply([], e);
                    return e
                }(a));
                var c, d;
                if ("string" == typeof r) {
                    var u;
                    d = i.$vnode && i.$vnode.ns || Yn.getTagNamespace(r), c = Yn.isReservedTag(r) ? new mi(Yn.parsePlatformTagName(r), s, a, void 0, void 0, i) : t(u = B(i.$options, "components", r)) ? Pe(u, s, i, a, r) : new mi(r, s, a, void 0, void 0, i)
                } else c = Pe(r, s, i, a);
                return Array.isArray(c) ? c : t(c) ? (t(d) && function i(o, r, s) {
                    if (o.ns = r, "foreignObject" === o.tag && (r = void 0, s = !0), t(o.children))
                        for (var a = 0, l = o.children.length; a < l; a++) {
                            var c = o.children[a];
                            t(c.tag) && (e(c.ns) || n(s) && "svg" !== c.tag) && i(c, r, s)
                        }
                }(c, d), t(s) && function(e) {
                    o(e.style) && Y(e.style), o(e.class) && Y(e.class)
                }(s), c) : yi()
            }(r, s, a, l, c)
    }

    function Ie(e) {
        var t = e.options;
        if (e.super) {
            var n = Ie(e.super);
            if (n !== e.superOptions) {
                e.superOptions = n;
                var i = function(e) {
                    var t, n = e.options,
                        i = e.extendOptions,
                        o = e.sealedOptions;
                    for (var r in n) n[r] !== o[r] && (t || (t = {}), t[r] = Be(n[r], i[r], o[r]));
                    return t
                }(e);
                i && h(e.extendOptions, i), (t = e.options = I(n, e.extendOptions)).name && (t.components[t.name] = e)
            }
        }
        return t
    }

    function Be(e, t, n) {
        if (Array.isArray(e)) {
            var i = [];
            n = Array.isArray(n) ? n : [n], t = Array.isArray(t) ? t : [t];
            for (var o = 0; o < e.length; o++)(0 <= t.indexOf(e[o]) || n.indexOf(e[o]) < 0) && i.push(e[o]);
            return i
        }
        return e
    }

    function He(e) {
        this._init(e)
    }

    function Re(e) {
        return e && (e.Ctor.options.name || e.tag)
    }

    function qe(e, t) {
        return Array.isArray(e) ? -1 < e.indexOf(t) : "string" == typeof e ? -1 < e.split(",").indexOf(t) : (n = e, "[object RegExp]" === Mn.call(n) && e.test(t));
        var n
    }

    function Fe(e, t) {
        var n = e.cache,
            i = e.keys,
            o = e._vnode;
        for (var r in n) {
            var s = n[r];
            if (s) {
                var a = Re(s.componentOptions);
                a && !t(a) && ze(n, r, i, o)
            }
        }
    }

    function ze(e, t, n, i) {
        var o = e[t];
        !o || i && o.tag === i.tag || o.componentInstance.$destroy(), e[t] = null, d(n, t)
    }

    function We(e) {
        for (var n = e.data, i = e, o = e; t(o.componentInstance);)(o = o.componentInstance._vnode) && o.data && (n = Ue(o.data, n));
        for (; t(i = i.parent);) i && i.data && (n = Ue(n, i.data));
        return function(e, n) {
            return t(e) || t(n) ? Ve(e, Xe(n)) : ""
        }(n.staticClass, n.class)
    }

    function Ue(e, n) {
        return {
            staticClass: Ve(e.staticClass, n.staticClass),
            class: t(e.class) ? [e.class, n.class] : n.class
        }
    }

    function Ve(e, t) {
        return e ? t ? e + " " + t : e : t || ""
    }

    function Xe(e) {
        return Array.isArray(e) ? function(e) {
            for (var n, i = "", o = 0, r = e.length; o < r; o++) t(n = Xe(e[o])) && "" !== n && (i && (i += " "), i += n);
            return i
        }(e) : o(e) ? function(e) {
            var t = "";
            for (var n in e) e[n] && (t && (t += " "), t += n);
            return t
        }(e) : "string" == typeof e ? e : ""
    }

    function Ye(e) {
        return jo(e) ? "svg" : "math" === e ? "math" : void 0
    }

    function Je(e) {
        if ("string" == typeof e) {
            return document.querySelector(e) || document.createElement("div")
        }
        return e
    }

    function Ke(e, n) {
        var i = e.data.ref;
        if (t(i)) {
            var o = e.context,
                r = e.componentInstance || e.elm,
                s = o.$refs;
            n ? Array.isArray(s[i]) ? d(s[i], r) : s[i] === r && (s[i] = void 0) : e.data.refInFor ? Array.isArray(s[i]) ? s[i].indexOf(r) < 0 && s[i].push(r) : s[i] = [r] : s[i] = r
        }
    }

    function Ge(i, o) {
        return i.key === o.key && (i.tag === o.tag && i.isComment === o.isComment && t(i.data) === t(o.data) && function(e, n) {
            if ("input" !== e.tag) return !0;
            var i, o = t(i = e.data) && t(i = i.attrs) && i.type,
                r = t(i = n.data) && t(i = i.attrs) && i.type;
            return o === r || Lo(o) && Lo(r)
        }(i, o) || n(i.isAsyncPlaceholder) && i.asyncFactory === o.asyncFactory && e(o.asyncFactory.error))
    }

    function Qe(e, n, i) {
        var o, r, s = {};
        for (o = n; o <= i; ++o) t(r = e[o].key) && (s[r] = o);
        return s
    }

    function Ze(e, t) {
        (e.data.directives || t.data.directives) && function(e, t) {
            var n, i, o, r = e === Io,
                s = t === Io,
                a = et(e.data.directives, e.context),
                l = et(t.data.directives, t.context),
                c = [],
                d = [];
            for (n in l) i = a[n], o = l[n], i ? (o.oldValue = i.value, tt(o, "update", t, e), o.def && o.def.componentUpdated && d.push(o)) : (tt(o, "bind", t, e), o.def && o.def.inserted && c.push(o));
            if (c.length) {
                var u = function() {
                    for (var n = 0; n < c.length; n++) tt(c[n], "inserted", t, e)
                };
                r ? G(t, "insert", u) : u()
            }
            if (d.length && G(t, "postpatch", function() {
                    for (var n = 0; n < d.length; n++) tt(d[n], "componentUpdated", t, e)
                }), !r)
                for (n in a) l[n] || tt(a[n], "unbind", e, e, s)
        }(e, t)
    }

    function et(e, t) {
        var n, i, o, r = Object.create(null);
        if (!e) return r;
        for (n = 0; n < e.length; n++)(i = e[n]).modifiers || (i.modifiers = Ro), (r[(o = i, o.rawName || o.name + "." + Object.keys(o.modifiers || {}).join("."))] = i).def = B(t.$options, "directives", i.name);
        return r
    }

    function tt(e, t, n, i, o) {
        var r = e.def && e.def[t];
        if (r) try {
            r(n.elm, e, n, i, o)
        } catch (i) {
            z(i, n.context, "directive " + e.name + " " + t + " hook")
        }
    }

    function nt(n, i) {
        var o = i.componentOptions;
        if (!(t(o) && !1 === o.Ctor.options.inheritAttrs || e(n.data.attrs) && e(i.data.attrs))) {
            var r, s, a = i.elm,
                l = n.data.attrs || {},
                c = i.data.attrs || {};
            for (r in t(c.__ob__) && (c = i.data.attrs = h({}, c)), c) s = c[r], l[r] !== s && it(a, r, s);
            for (r in (ti || ii) && c.value !== l.value && it(a, "value", c.value), l) e(c[r]) && (_o(r) ? a.removeAttributeNS(So, To(r)) : $o(r) || a.removeAttribute(r))
        }
    }

    function it(e, t, n) {
        -1 < e.tagName.indexOf("-") ? ot(e, t, n) : ko(t) ? Ao(n) ? e.removeAttribute(t) : (n = "allowfullscreen" === t && "EMBED" === e.tagName ? "true" : t, e.setAttribute(t, n)) : $o(t) ? e.setAttribute(t, Ao(n) || "false" === n ? "false" : "true") : _o(t) ? Ao(n) ? e.removeAttributeNS(So, To(t)) : e.setAttributeNS(So, t, n) : ot(e, t, n)
    }

    function ot(e, t, n) {
        if (Ao(n)) e.removeAttribute(t);
        else {
            if (ti && !ni && "TEXTAREA" === e.tagName && "placeholder" === t && !e.__ieph) {
                var i = function(t) {
                    t.stopImmediatePropagation(), e.removeEventListener("input", i)
                };
                e.addEventListener("input", i), e.__ieph = !0
            }
            e.setAttribute(t, n)
        }
    }

    function rt(n, i) {
        var o = i.elm,
            r = i.data,
            s = n.data;
        if (!(e(r.staticClass) && e(r.class) && (e(s) || e(s.staticClass) && e(s.class)))) {
            var a = We(i),
                l = o._transitionClasses;
            t(l) && (a = Ve(a, Xe(l))), a !== o._prevClass && (o.setAttribute("class", a), o._prevClass = a)
        }
    }

    function st(e) {
        function t() {
            (s || (s = [])).push(e.slice(h, o).trim()), h = o + 1
        }
        var n, i, o, r, s, a = !1,
            l = !1,
            c = !1,
            d = !1,
            u = 0,
            p = 0,
            f = 0,
            h = 0;
        for (o = 0; o < e.length; o++)
            if (i = n, n = e.charCodeAt(o), a) 39 === n && 92 !== i && (a = !1);
            else if (l) 34 === n && 92 !== i && (l = !1);
        else if (c) 96 === n && 92 !== i && (c = !1);
        else if (d) 47 === n && 92 !== i && (d = !1);
        else if (124 !== n || 124 === e.charCodeAt(o + 1) || 124 === e.charCodeAt(o - 1) || u || p || f) {
            switch (n) {
                case 34:
                    l = !0;
                    break;
                case 39:
                    a = !0;
                    break;
                case 96:
                    c = !0;
                    break;
                case 40:
                    f++;
                    break;
                case 41:
                    f--;
                    break;
                case 91:
                    p++;
                    break;
                case 93:
                    p--;
                    break;
                case 123:
                    u++;
                    break;
                case 125:
                    u--
            }
            if (47 === n) {
                for (var v = o - 1, m = void 0; 0 <= v && " " === (m = e.charAt(v)); v--);
                m && Wo.test(m) || (d = !0)
            }
        } else void 0 === r ? (h = o + 1, r = e.slice(0, o).trim()) : t();
        if (void 0 === r ? r = e.slice(0, o).trim() : 0 !== h && t(), s)
            for (o = 0; o < s.length; o++) r = at(r, s[o]);
        return r
    }

    function at(e, t) {
        var n = t.indexOf("(");
        if (n < 0) return '_f("' + t + '")(' + e + ")";
        var i = t.slice(0, n),
            o = t.slice(n + 1);
        return '_f("' + i + '")(' + e + (")" !== o ? "," + o : o)
    }

    function lt(e) {
        console.error("[Vue compiler]: " + e)
    }

    function ct(e, t) {
        return e ? e.map(function(e) {
            return e[t]
        }).filter(function(e) {
            return e
        }) : []
    }

    function dt(e, t, n) {
        (e.props || (e.props = [])).push({
            name: t,
            value: n
        }), e.plain = !1
    }

    function ut(e, t, n) {
        (e.attrs || (e.attrs = [])).push({
            name: t,
            value: n
        }), e.plain = !1
    }

    function pt(e, t, n) {
        e.attrsMap[t] = n, e.attrsList.push({
            name: t,
            value: n
        })
    }

    function ft(e, t, n, i, o, r) {
        var s;
        (i = i || On).capture && (delete i.capture, t = "!" + t), i.once && (delete i.once, t = "~" + t), i.passive && (delete i.passive, t = "&" + t), "click" === t && (i.right ? (t = "contextmenu", delete i.right) : i.middle && (t = "mouseup")), i.native ? (delete i.native, s = e.nativeEvents || (e.nativeEvents = {})) : s = e.events || (e.events = {});
        var a = {
            value: n.trim()
        };
        i !== On && (a.modifiers = i);
        var l = s[t];
        Array.isArray(l) ? o ? l.unshift(a) : l.push(a) : s[t] = l ? o ? [a, l] : [l, a] : a, e.plain = !1
    }

    function ht(e, t, n) {
        var i = vt(e, ":" + t) || vt(e, "v-bind:" + t);
        if (null != i) return st(i);
        if (!1 !== n) {
            var o = vt(e, t);
            if (null != o) return JSON.stringify(o)
        }
    }

    function vt(e, t, n) {
        var i;
        if (null != (i = e.attrsMap[t]))
            for (var o = e.attrsList, r = 0, s = o.length; r < s; r++)
                if (o[r].name === t) {
                    o.splice(r, 1);
                    break
                }
        return n && delete e.attrsMap[t], i
    }

    function mt(e, t, n) {
        var i = n || {},
            o = i.number,
            r = "$$v";
        i.trim && (r = "(typeof $$v === 'string'? $$v.trim(): $$v)"), o && (r = "_n(" + r + ")");
        var s = gt(t, r);
        e.model = {
            value: "(" + t + ")",
            expression: '"' + t + '"',
            callback: "function ($$v) {" + s + "}"
        }
    }

    function gt(e, t) {
        var n = function(e) {
            if (e = e.trim(), po = e.length, e.indexOf("[") < 0 || e.lastIndexOf("]") < po - 1) return -1 < (vo = e.lastIndexOf(".")) ? {
                exp: e.slice(0, vo),
                key: '"' + e.slice(vo + 1) + '"'
            } : {
                exp: e,
                key: null
            };
            for (fo = e, vo = mo = go = 0; !bt();) wt(ho = yt()) ? Ct(ho) : 91 === ho && xt(ho);
            return {
                exp: e.slice(0, mo),
                key: e.slice(mo + 1, go)
            }
        }(e);
        return null === n.key ? e + "=" + t : "$set(" + n.exp + ", " + n.key + ", " + t + ")"
    }

    function yt() {
        return fo.charCodeAt(++vo)
    }

    function bt() {
        return po <= vo
    }

    function wt(e) {
        return 34 === e || 39 === e
    }

    function xt(e) {
        var t = 1;
        for (mo = vo; !bt();)
            if (wt(e = yt())) Ct(e);
            else if (91 === e && t++, 93 === e && t--, 0 === t) {
            go = vo;
            break
        }
    }

    function Ct(e) {
        for (var t = e; !bt() && (e = yt()) !== t;);
    }

    function $t(e, t, n, i, o) {
        var r, s, a, l, c;
        t = (r = t)._withTask || (r._withTask = function() {
            Ei = !0;
            var e = r.apply(null, arguments);
            return Ei = !1, e
        }), n && (s = t, a = e, l = i, c = yo, t = function e() {
            null !== s.apply(null, arguments) && kt(a, e, l, c)
        }), yo.addEventListener(e, t, si ? {
            capture: i,
            passive: o
        } : i)
    }

    function kt(e, t, n, i) {
        (i || yo).removeEventListener(e, t._withTask || t, n)
    }

    function St(n, i) {
        if (!e(n.data.on) || !e(i.data.on)) {
            var o = i.data.on || {},
                r = n.data.on || {};
            yo = i.elm,
                function(e) {
                    if (t(e[Uo])) {
                        var n = ti ? "change" : "input";
                        e[n] = [].concat(e[Uo], e[n] || []), delete e[Uo]
                    }
                    t(e[Vo]) && (e.change = [].concat(e[Vo], e.change || []), delete e[Vo])
                }(o), K(o, r, $t, kt, i.context), yo = void 0
        }
    }

    function _t(n, i) {
        if (!e(n.data.domProps) || !e(i.data.domProps)) {
            var o, r, s, a, c = i.elm,
                d = n.data.domProps || {},
                u = i.data.domProps || {};
            for (o in t(u.__ob__) && (u = i.data.domProps = h({}, u)), d) e(u[o]) && (c[o] = "");
            for (o in u) {
                if (r = u[o], "textContent" === o || "innerHTML" === o) {
                    if (i.children && (i.children.length = 0), r === d[o]) continue;
                    1 === c.childNodes.length && c.removeChild(c.childNodes[0])
                }
                if ("value" === o) {
                    var p = e(c._value = r) ? "" : String(r);
                    a = p, (s = c).composing || "OPTION" !== s.tagName && ! function(e, t) {
                        var n = !0;
                        try {
                            n = document.activeElement !== e
                        } catch (e) {}
                        return n && e.value !== t
                    }(s, a) && ! function(e, n) {
                        var i = e.value,
                            o = e._vModifiers;
                        if (t(o)) {
                            if (o.lazy) return !1;
                            if (o.number) return l(i) !== l(n);
                            if (o.trim) return i.trim() !== n.trim()
                        }
                        return i !== n
                    }(s, a) || (c.value = p)
                } else c[o] = r
            }
        }
    }

    function Tt(e) {
        var t = At(e.style);
        return e.staticStyle ? h(e.staticStyle, t) : t
    }

    function At(e) {
        return Array.isArray(e) ? v(e) : "string" == typeof e ? Jo(e) : e
    }

    function Dt(n, i) {
        var o = i.data,
            r = n.data;
        if (!(e(o.staticStyle) && e(o.style) && e(r.staticStyle) && e(r.style))) {
            var s, a, l = i.elm,
                c = r.staticStyle,
                d = r.normalizedStyle || r.style || {},
                u = c || d,
                p = At(i.data.style) || {};
            i.data.normalizedStyle = t(p.__ob__) ? h({}, p) : p;
            var f = function(e, t) {
                for (var n, i = {}, o = e; o.componentInstance;)(o = o.componentInstance._vnode) && o.data && (n = Tt(o.data)) && h(i, n);
                (n = Tt(e.data)) && h(i, n);
                for (var r = e; r = r.parent;) r.data && (n = Tt(r.data)) && h(i, n);
                return i
            }(i);
            for (a in u) e(f[a]) && Qo(l, a, "");
            for (a in f)(s = f[a]) !== u[a] && Qo(l, a, null == s ? "" : s)
        }
    }

    function Et(e, t) {
        if (t && (t = t.trim()))
            if (e.classList) - 1 < t.indexOf(" ") ? t.split(/\s+/).forEach(function(t) {
                return e.classList.add(t)
            }) : e.classList.add(t);
            else {
                var n = " " + (e.getAttribute("class") || "") + " ";
                n.indexOf(" " + t + " ") < 0 && e.setAttribute("class", (n + t).trim())
            }
    }

    function jt(e, t) {
        if (t && (t = t.trim()))
            if (e.classList) - 1 < t.indexOf(" ") ? t.split(/\s+/).forEach(function(t) {
                return e.classList.remove(t)
            }) : e.classList.remove(t), e.classList.length || e.removeAttribute("class");
            else {
                for (var n = " " + (e.getAttribute("class") || "") + " ", i = " " + t + " "; 0 <= n.indexOf(i);) n = n.replace(i, " ");
                (n = n.trim()) ? e.setAttribute("class", n): e.removeAttribute("class")
            }
    }

    function Ot(e) {
        if (e) {
            if ("object" == typeof e) {
                var t = {};
                return !1 !== e.css && h(t, nr(e.name || "v")), h(t, e), t
            }
            return "string" == typeof e ? nr(e) : void 0
        }
    }

    function Mt(e) {
        dr(function() {
            dr(e)
        })
    }

    function Lt(e, t) {
        var n = e._transitionClasses || (e._transitionClasses = []);
        n.indexOf(t) < 0 && (n.push(t), Et(e, t))
    }

    function Pt(e, t) {
        e._transitionClasses && d(e._transitionClasses, t), jt(e, t)
    }

    function Nt(e, t, n) {
        var i = It(e, t),
            o = i.type,
            r = i.timeout,
            s = i.propCount;
        if (!o) return n();
        var a = o === or ? ar : cr,
            l = 0,
            c = function() {
                e.removeEventListener(a, d), n()
            },
            d = function(t) {
                t.target === e && ++l >= s && c()
            };
        setTimeout(function() {
            l < s && c()
        }, r + 1), e.addEventListener(a, d)
    }

    function It(e, t) {
        var n, i = window.getComputedStyle(e),
            o = i[sr + "Delay"].split(", "),
            r = i[sr + "Duration"].split(", "),
            s = Bt(o, r),
            a = i[lr + "Delay"].split(", "),
            l = i[lr + "Duration"].split(", "),
            c = Bt(a, l),
            d = 0,
            u = 0;
        return t === or ? 0 < s && (n = or, d = s, u = r.length) : t === rr ? 0 < c && (n = rr, d = c, u = l.length) : u = (n = 0 < (d = Math.max(s, c)) ? c < s ? or : rr : null) ? n === or ? r.length : l.length : 0, {
            type: n,
            timeout: d,
            propCount: u,
            hasTransform: n === or && ur.test(i[sr + "Property"])
        }
    }

    function Bt(e, t) {
        for (; e.length < t.length;) e = e.concat(e);
        return Math.max.apply(null, t.map(function(t, n) {
            return Ht(t) + Ht(e[n])
        }))
    }

    function Ht(e) {
        return 1e3 * Number(e.slice(0, -1))
    }

    function Rt(n, i) {
        var r = n.elm;
        t(r._leaveCb) && (r._leaveCb.cancelled = !0, r._leaveCb());
        var s = Ot(n.data.transition);
        if (!e(s) && !t(r._enterCb) && 1 === r.nodeType) {
            for (var a = s.css, c = s.type, d = s.enterClass, u = s.enterToClass, p = s.enterActiveClass, f = s.appearClass, h = s.appearToClass, v = s.appearActiveClass, m = s.beforeEnter, g = s.enter, y = s.afterEnter, w = s.enterCancelled, x = s.beforeAppear, C = s.appear, $ = s.afterAppear, k = s.appearCancelled, S = s.duration, _ = Ii, T = Ii.$vnode; T && T.parent;) _ = (T = T.parent).context;
            var A = !_._isMounted || !n.isRootInsert;
            if (!A || C || "" === C) {
                var D = A && f ? f : d,
                    E = A && v ? v : p,
                    j = A && h ? h : u,
                    O = A && x || m,
                    M = A && "function" == typeof C ? C : g,
                    L = A && $ || y,
                    P = A && k || w,
                    N = l(o(S) ? S.enter : S),
                    I = !1 !== a && !ni,
                    B = zt(M),
                    H = r._enterCb = b(function() {
                        I && (Pt(r, j), Pt(r, E)), H.cancelled ? (I && Pt(r, D), P && P(r)) : L && L(r), r._enterCb = null
                    });
                n.data.show || G(n, "insert", function() {
                    var e = r.parentNode,
                        t = e && e._pending && e._pending[n.key];
                    t && t.tag === n.tag && t.elm._leaveCb && t.elm._leaveCb(), M && M(r, H)
                }), O && O(r), I && (Lt(r, D), Lt(r, E), Mt(function() {
                    Pt(r, D), H.cancelled || (Lt(r, j), B || (Ft(N) ? setTimeout(H, N) : Nt(r, c, H)))
                })), n.data.show && (i && i(), M && M(r, H)), I || B || H()
            }
        }
    }

    function qt(n, i) {
        function r() {
            k.cancelled || (n.data.show || ((s.parentNode._pending || (s.parentNode._pending = {}))[n.key] = n), h && h(s), x && (Lt(s, u), Lt(s, f), Mt(function() {
                Pt(s, u), k.cancelled || (Lt(s, p), C || (Ft($) ? setTimeout(k, $) : Nt(s, d, k)))
            })), v && v(s, k), x || C || k())
        }
        var s = n.elm;
        t(s._enterCb) && (s._enterCb.cancelled = !0, s._enterCb());
        var a = Ot(n.data.transition);
        if (e(a) || 1 !== s.nodeType) return i();
        if (!t(s._leaveCb)) {
            var c = a.css,
                d = a.type,
                u = a.leaveClass,
                p = a.leaveToClass,
                f = a.leaveActiveClass,
                h = a.beforeLeave,
                v = a.leave,
                m = a.afterLeave,
                g = a.leaveCancelled,
                y = a.delayLeave,
                w = a.duration,
                x = !1 !== c && !ni,
                C = zt(v),
                $ = l(o(w) ? w.leave : w),
                k = s._leaveCb = b(function() {
                    s.parentNode && s.parentNode._pending && (s.parentNode._pending[n.key] = null), x && (Pt(s, p), Pt(s, f)), k.cancelled ? (x && Pt(s, u), g && g(s)) : (i(), m && m(s)), s._leaveCb = null
                });
            y ? y(r) : r()
        }
    }

    function Ft(e) {
        return "number" == typeof e && !isNaN(e)
    }

    function zt(n) {
        if (e(n)) return !1;
        var i = n.fns;
        return t(i) ? zt(Array.isArray(i) ? i[0] : i) : 1 < (n._length || n.length)
    }

    function Wt(e, t) {
        !0 !== t.data.show && Rt(t)
    }

    function Ut(e, t, n) {
        Vt(e, t, n), (ti || ii) && setTimeout(function() {
            Vt(e, t, n)
        }, 0)
    }

    function Vt(e, t, n) {
        var i = t.value,
            o = e.multiple;
        if (!o || Array.isArray(i)) {
            for (var r, s, a = 0, l = e.options.length; a < l; a++)
                if (s = e.options[a], o) r = -1 < y(i, Yt(s)), s.selected !== r && (s.selected = r);
                else if (g(Yt(s), i)) return void(e.selectedIndex !== a && (e.selectedIndex = a));
            o || (e.selectedIndex = -1)
        }
    }

    function Xt(e, t) {
        return t.every(function(t) {
            return !g(t, e)
        })
    }

    function Yt(e) {
        return "_value" in e ? e._value : e.value
    }

    function Jt(e) {
        e.target.composing = !0
    }

    function Kt(e) {
        e.target.composing && (e.target.composing = !1, Gt(e.target, "input"))
    }

    function Gt(e, t) {
        var n = document.createEvent("HTMLEvents");
        n.initEvent(t, !0, !0), e.dispatchEvent(n)
    }

    function Qt(e) {
        return !e.componentInstance || e.data && e.data.transition ? e : Qt(e.componentInstance._vnode)
    }

    function Zt(e) {
        var t = e && e.componentOptions;
        return t && t.Ctor.options.abstract ? Zt(ie(t.children)) : e
    }

    function en(e) {
        var t = {},
            n = e.$options;
        for (var i in n.propsData) t[i] = e[i];
        var o = n._parentListeners;
        for (var r in o) t[Bn(r)] = o[r];
        return t
    }

    function tn(e, t) {
        if (/\d-keep-alive$/.test(t.tag)) return e("keep-alive", {
            props: t.componentOptions.propsData
        })
    }

    function nn(e) {
        e.elm._moveCb && e.elm._moveCb(), e.elm._enterCb && e.elm._enterCb()
    }

    function on(e) {
        e.data.newPos = e.elm.getBoundingClientRect()
    }

    function rn(e) {
        var t = e.data.pos,
            n = e.data.newPos,
            i = t.left - n.left,
            o = t.top - n.top;
        if (i || o) {
            e.data.moved = !0;
            var r = e.elm.style;
            r.transform = r.WebkitTransform = "translate(" + i + "px," + o + "px)", r.transitionDuration = "0s"
        }
    }

    function sn(e, t, n) {
        return {
            type: 1,
            tag: e,
            attrsList: t,
            attrsMap: function(e) {
                for (var t = {}, n = 0, i = e.length; n < i; n++) t[e[n].name] = e[n].value;
                return t
            }(t),
            parent: n,
            children: []
        }
    }

    function an(e, t) {
        function n(e) {
            e.pre && (a = !1), Wr(e.tag) && (l = !1);
            for (var n = 0; n < zr.length; n++) zr[n](e, t)
        }
        Hr = t.warn || lt, Wr = t.isPreTag || zn, Ur = t.mustUseProp || zn, Vr = t.getTagNamespace || zn, qr = ct(t.modules, "transformNode"), Fr = ct(t.modules, "preTransformNode"), zr = ct(t.modules, "postTransformNode"), Rr = t.delimiters;
        var i, o, r = [],
            s = !1 !== t.preserveWhitespace,
            a = !1,
            l = !1;
        return function(e, t) {
            function n(t) {
                d += t, e = e.substring(t)
            }

            function i(e, n, i) {
                var o, a;
                if (null == n && (n = d), null == i && (i = d), e && (a = e.toLowerCase()), e)
                    for (o = s.length - 1; 0 <= o && s[o].lowerCasedTag !== a; o--);
                else o = 0;
                if (0 <= o) {
                    for (var l = s.length - 1; o <= l; l--) t.end && t.end(s[l].tag, n, i);
                    s.length = o, r = o && s[o - 1].tag
                } else "br" === a ? t.start && t.start(e, [], !0, n, i) : "p" === a && (t.start && t.start(e, [], !1, n, i), t.end && t.end(e, n, i))
            }
            for (var o, r, s = [], a = t.expectHTML, l = t.isUnaryTag || zn, c = t.canBeLeftOpenTag || zn, d = 0; e;) {
                if (o = e, r && Kr(r)) {
                    var u = 0,
                        p = r.toLowerCase(),
                        f = Gr[p] || (Gr[p] = new RegExp("([\\s\\S]*?)(</" + p + "[^>]*>)", "i")),
                        h = e.replace(f, function(e, n, i) {
                            return u = i.length, Kr(p) || "noscript" === p || (n = n.replace(/<!\--([\s\S]*?)-->/g, "$1").replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1")), ns(p, n) && (n = n.slice(1)), t.chars && t.chars(n), ""
                        });
                    d += e.length - h.length, e = h, i(p, d - u, d)
                } else {
                    var v = e.indexOf("<");
                    if (0 === v) {
                        if (Nr.test(e)) {
                            var m = e.indexOf("--\x3e");
                            if (0 <= m) {
                                t.shouldKeepComment && t.comment(e.substring(4, m)), n(m + 3);
                                continue
                            }
                        }
                        if (Ir.test(e)) {
                            var g = e.indexOf("]>");
                            if (0 <= g) {
                                n(g + 2);
                                continue
                            }
                        }
                        var y = e.match(Pr);
                        if (y) {
                            n(y[0].length);
                            continue
                        }
                        var b = e.match(Lr);
                        if (b) {
                            var w = d;
                            n(b[0].length), i(b[1], w, d);
                            continue
                        }
                        var x = function() {
                            var t = e.match(Or);
                            if (t) {
                                var i, o, r = {
                                    tagName: t[1],
                                    attrs: [],
                                    start: d
                                };
                                for (n(t[0].length); !(i = e.match(Mr)) && (o = e.match(Dr));) n(o[0].length), r.attrs.push(o);
                                if (i) return r.unarySlash = i[1], n(i[0].length), r.end = d, r
                            }
                        }();
                        if (x) {
                            (function(e) {
                                var n = e.tagName,
                                    o = e.unarySlash;
                                a && ("p" === r && Ar(n) && i(r), c(n) && r === n && i(n));
                                for (var d, u, p, f = l(n) || !!o, h = e.attrs.length, v = new Array(h), m = 0; m < h; m++) {
                                    var g = e.attrs[m];
                                    Br && -1 === g[0].indexOf('""') && ("" === g[3] && delete g[3], "" === g[4] && delete g[4], "" === g[5] && delete g[5]);
                                    var y = g[3] || g[4] || g[5] || "",
                                        b = "a" === n && "href" === g[1] ? t.shouldDecodeNewlinesForHref : t.shouldDecodeNewlines;
                                    v[m] = {
                                        name: g[1],
                                        value: (d = y, u = b, p = u ? es : Zr, d.replace(p, function(e) {
                                            return Qr[e]
                                        }))
                                    }
                                }
                                f || (s.push({
                                    tag: n,
                                    lowerCasedTag: n.toLowerCase(),
                                    attrs: v
                                }), r = n), t.start && t.start(n, v, f, e.start, e.end)
                            })(x), ns(r, e) && n(1);
                            continue
                        }
                    }
                    var C = void 0,
                        $ = void 0,
                        k = void 0;
                    if (0 <= v) {
                        for ($ = e.slice(v); !(Lr.test($) || Or.test($) || Nr.test($) || Ir.test($) || (k = $.indexOf("<", 1)) < 0);) v += k, $ = e.slice(v);
                        C = e.substring(0, v), n(v)
                    }
                    v < 0 && (C = e, e = ""), t.chars && C && t.chars(C)
                }
                if (e === o) {
                    t.chars && t.chars(e);
                    break
                }
            }
            i()
        }(e, {
            warn: Hr,
            expectHTML: t.expectHTML,
            isUnaryTag: t.isUnaryTag,
            canBeLeftOpenTag: t.canBeLeftOpenTag,
            shouldDecodeNewlines: t.shouldDecodeNewlines,
            shouldDecodeNewlinesForHref: t.shouldDecodeNewlinesForHref,
            shouldKeepComment: t.comments,
            start: function(e, s, c) {
                var d = o && o.ns || Vr(e);
                ti && "svg" === d && (s = function(e) {
                    for (var t = [], n = 0; n < e.length; n++) {
                        var i = e[n];
                        ps.test(i.name) || (i.name = i.name.replace(fs, ""), t.push(i))
                    }
                    return t
                }(s));
                var u, p, f, h, v, m = sn(e, s, o);
                d && (m.ns = d), "style" !== (u = m).tag && ("script" !== u.tag || u.attrsMap.type && "text/javascript" !== u.attrsMap.type) || ci() || (m.forbidden = !0);
                for (var g = 0; g < Fr.length; g++) m = Fr[g](m, t) || m;
                if (a || (null != vt(p = m, "v-pre") && (p.pre = !0), m.pre && (a = !0)), Wr(m.tag) && (l = !0), a ? function(e) {
                        var t = e.attrsList.length;
                        if (t)
                            for (var n = e.attrs = new Array(t), i = 0; i < t; i++) n[i] = {
                                name: e.attrsList[i].name,
                                value: JSON.stringify(e.attrsList[i].value)
                            };
                        else e.pre || (e.plain = !0)
                    }(m) : m.processed || (cn(m), function(e) {
                        var t = vt(e, "v-if");
                        if (t) e.if = t, dn(e, {
                            exp: t,
                            block: e
                        });
                        else {
                            null != vt(e, "v-else") && (e.else = !0);
                            var n = vt(e, "v-else-if");
                            n && (e.elseif = n)
                        }
                    }(m), null != vt(f = m, "v-once") && (f.once = !0), ln(m, t)), i ? r.length || i.if && (m.elseif || m.else) && dn(i, {
                        exp: m.elseif,
                        block: m
                    }) : i = m, o && !m.forbidden)
                    if (m.elseif || m.else) h = m, (v = function(e) {
                        for (var t = e.length; t--;) {
                            if (1 === e[t].type) return e[t];
                            e.pop()
                        }
                    }(o.children)) && v.if && dn(v, {
                        exp: h.elseif,
                        block: h
                    });
                    else if (m.slotScope) {
                    o.plain = !1;
                    var y = m.slotTarget || '"default"';
                    (o.scopedSlots || (o.scopedSlots = {}))[y] = m
                } else o.children.push(m), m.parent = o;
                c ? n(m) : (o = m, r.push(m))
            },
            end: function() {
                var e = r[r.length - 1],
                    t = e.children[e.children.length - 1];
                t && 3 === t.type && " " === t.text && !l && e.children.pop(), r.length -= 1, o = r[r.length - 1], n(e)
            },
            chars: function(e) {
                if (o && (!ti || "textarea" !== o.tag || o.attrsMap.placeholder !== e)) {
                    var t, n, i = o.children;
                    (e = l || e.trim() ? "script" === (t = o).tag || "style" === t.tag ? e : us(e) : s && i.length ? " " : "") && (!a && " " !== e && (n = function(e, t) {
                        var n = t ? Cr(t) : wr;
                        if (n.test(e)) {
                            for (var i, o, r, s = [], a = [], l = n.lastIndex = 0; i = n.exec(e);) {
                                l < (o = i.index) && (a.push(r = e.slice(l, o)), s.push(JSON.stringify(r)));
                                var c = st(i[1].trim());
                                s.push("_s(" + c + ")"), a.push({
                                    "@binding": c
                                }), l = o + i[0].length
                            }
                            return l < e.length && (a.push(r = e.slice(l)), s.push(JSON.stringify(r))), {
                                expression: s.join("+"),
                                tokens: a
                            }
                        }
                    }(e, Rr)) ? i.push({
                        type: 2,
                        expression: n.expression,
                        tokens: n.tokens,
                        text: e
                    }) : " " === e && i.length && " " === i[i.length - 1].text || i.push({
                        type: 3,
                        text: e
                    }))
                }
            },
            comment: function(e) {
                o.children.push({
                    type: 3,
                    text: e,
                    isComment: !0
                })
            }
        }), i
    }

    function ln(e, t) {
        var n, i, o, r;
        (i = ht(n = e, "key")) && (n.key = i), e.plain = !e.key && !e.attrsList.length, (r = ht(o = e, "ref")) && (o.ref = r, o.refInFor = function(e) {
                for (var t = e; t;) {
                    if (void 0 !== t.for) return !0;
                    t = t.parent
                }
                return !1
            }(o)),
            function(e) {
                if ("slot" === e.tag) e.slotName = ht(e, "name");
                else {
                    var t;
                    "template" === e.tag ? (t = vt(e, "scope"), e.slotScope = t || vt(e, "slot-scope")) : (t = vt(e, "slot-scope")) && (e.slotScope = t);
                    var n = ht(e, "slot");
                    n && (e.slotTarget = '""' === n ? '"default"' : n, "template" === e.tag || e.slotScope || ut(e, "slot", n))
                }
            }(e),
            function(e) {
                var t;
                (t = ht(e, "is")) && (e.component = t), null != vt(e, "inline-template") && (e.inlineTemplate = !0)
            }(e);
        for (var s = 0; s < qr.length; s++) e = qr[s](e, t) || e;
        ! function(e) {
            var t, n, i, o, r, s, a, l = e.attrsList;
            for (t = 0, n = l.length; t < n; t++)
                if (i = o = l[t].name, r = l[t].value, os.test(i))
                    if (e.hasBindings = !0, (s = un(i)) && (i = i.replace(ds, "")), cs.test(i)) i = i.replace(cs, ""), r = st(r), a = !1, s && (s.prop && (a = !0, "innerHtml" === (i = Bn(i)) && (i = "innerHTML")), s.camel && (i = Bn(i)), s.sync && ft(e, "update:" + Bn(i), gt(r, "$event"))), a || !e.component && Ur(e.tag, e.attrsMap.type, i) ? dt(e, i, r) : ut(e, i, r);
                    else if (is.test(i)) i = i.replace(is, ""), ft(e, i, r, s, !1);
            else {
                var c = (i = i.replace(os, "")).match(ls),
                    d = c && c[1];
                d && (i = i.slice(0, -(d.length + 1))), p = i, f = o, h = r, v = d, m = s, ((u = e).directives || (u.directives = [])).push({
                    name: p,
                    rawName: f,
                    value: h,
                    arg: v,
                    modifiers: m
                }), u.plain = !1
            } else ut(e, i, JSON.stringify(r)), !e.component && "muted" === i && Ur(e.tag, e.attrsMap.type, i) && dt(e, i, "true");
            var u, p, f, h, v, m
        }(e)
    }

    function cn(e) {
        var t;
        if (t = vt(e, "v-for")) {
            var n = function(e) {
                var t = e.match(rs);
                if (t) {
                    var n = {};
                    n.for = t[2].trim();
                    var i = t[1].trim().replace(as, ""),
                        o = i.match(ss);
                    return o ? (n.alias = i.replace(ss, ""), n.iterator1 = o[1].trim(), o[2] && (n.iterator2 = o[2].trim())) : n.alias = i, n
                }
            }(t);
            n && h(e, n)
        }
    }

    function dn(e, t) {
        e.ifConditions || (e.ifConditions = []), e.ifConditions.push(t)
    }

    function un(e) {
        var t = e.match(ds);
        if (t) {
            var n = {};
            return t.forEach(function(e) {
                n[e.slice(1)] = !0
            }), n
        }
    }

    function pn(e) {
        return sn(e.tag, e.attrsList.slice(), e.parent)
    }

    function fn(e, t) {
        e && (Yr = ms(t.staticKeys || ""), Jr = t.isReservedTag || zn, function e(t) {
            if (t.static = function(e) {
                    return 2 !== e.type && (3 === e.type || !(!e.pre && (e.hasBindings || e.if || e.for || Ln(e.tag) || !Jr(e.tag) || function(e) {
                        for (; e.parent;) {
                            if ("template" !== (e = e.parent).tag) return !1;
                            if (e.for) return !0
                        }
                        return !1
                    }(e) || !Object.keys(e).every(Yr))))
                }(t), 1 === t.type) {
                if (!Jr(t.tag) && "slot" !== t.tag && null == t.attrsMap["inline-template"]) return;
                for (var n = 0, i = t.children.length; n < i; n++) {
                    var o = t.children[n];
                    e(o), o.static || (t.static = !1)
                }
                if (t.ifConditions)
                    for (var r = 1, s = t.ifConditions.length; r < s; r++) {
                        var a = t.ifConditions[r].block;
                        e(a), a.static || (t.static = !1)
                    }
            }
        }(e), function e(t, n) {
            if (1 === t.type) {
                if ((t.static || t.once) && (t.staticInFor = n), t.static && t.children.length && (1 !== t.children.length || 3 !== t.children[0].type)) return void(t.staticRoot = !0);
                if (t.staticRoot = !1, t.children)
                    for (var i = 0, o = t.children.length; i < o; i++) e(t.children[i], n || !!t.for);
                if (t.ifConditions)
                    for (var r = 1, s = t.ifConditions.length; r < s; r++) e(t.ifConditions[r].block, n)
            }
        }(e, !1))
    }

    function hn(e, t, n) {
        var i = t ? "nativeOn:{" : "on:{";
        for (var o in e) i += '"' + o + '":' + vn(o, e[o]) + ",";
        return i.slice(0, -1) + "}"
    }

    function vn(e, t) {
        if (!t) return "function(){}";
        if (Array.isArray(t)) return "[" + t.map(function(t) {
            return vn(e, t)
        }).join(",") + "]";
        var n = ys.test(t.value),
            i = gs.test(t.value);
        if (t.modifiers) {
            var o = "",
                r = "",
                s = [];
            for (var a in t.modifiers)
                if (Cs[a]) r += Cs[a], bs[a] && s.push(a);
                else if ("exact" === a) {
                var l = t.modifiers;
                r += xs(["ctrl", "shift", "alt", "meta"].filter(function(e) {
                    return !l[e]
                }).map(function(e) {
                    return "$event." + e + "Key"
                }).join("||"))
            } else s.push(a);
            return s.length && (o += "if(!('button' in $event)&&" + s.map(mn).join("&&") + ")return null;"), r && (o += r), "function($event){" + o + (n ? "return " + t.value + "($event)" : i ? "return (" + t.value + ")($event)" : t.value) + "}"
        }
        return n || i ? t.value : "function($event){" + t.value + "}"
    }

    function mn(e) {
        var t = parseInt(e, 10);
        if (t) return "$event.keyCode!==" + t;
        var n = bs[e],
            i = ws[e];
        return "_k($event.keyCode," + JSON.stringify(e) + "," + JSON.stringify(n) + ",$event.key," + JSON.stringify(i) + ")"
    }

    function gn(e, t) {
        var n = new ks(t);
        return {
            render: "with(this){return " + (e ? yn(e, n) : '_c("div")') + "}",
            staticRenderFns: n.staticRenderFns
        }
    }

    function yn(e, t) {
        if (e.staticRoot && !e.staticProcessed) return bn(e, t);
        if (e.once && !e.onceProcessed) return wn(e, t);
        if (e.for && !e.forProcessed) return u = t, h = (d = e).for, v = d.alias, m = d.iterator1 ? "," + d.iterator1 : "", g = d.iterator2 ? "," + d.iterator2 : "", d.forProcessed = !0, (f || "_l") + "((" + h + "),function(" + v + m + g + "){return " + (p || yn)(d, u) + "})";
        if (e.if && !e.ifProcessed) return xn(e, t);
        if ("template" !== e.tag || e.slotTarget) {
            if ("slot" === e.tag) return function(e, t) {
                var n = e.slotName || '"default"',
                    i = kn(e, t),
                    o = "_t(" + n + (i ? "," + i : ""),
                    r = e.attrs && "{" + e.attrs.map(function(e) {
                        return Bn(e.name) + ":" + e.value
                    }).join(",") + "}",
                    s = e.attrsMap["v-bind"];
                return !r && !s || i || (o += ",null"), r && (o += "," + r), s && (o += (r ? "" : ",null") + "," + s), o + ")"
            }(e, t);
            var n;
            if (e.component) s = e.component, l = t, c = (a = e).inlineTemplate ? null : kn(a, l, !0), n = "_c(" + s + "," + Cn(a, l) + (c ? "," + c : "") + ")";
            else {
                var i = e.plain ? void 0 : Cn(e, t),
                    o = e.inlineTemplate ? null : kn(e, t, !0);
                n = "_c('" + e.tag + "'" + (i ? "," + i : "") + (o ? "," + o : "") + ")"
            }
            for (var r = 0; r < t.transforms.length; r++) n = t.transforms[r](e, n);
            return n
        }
        return kn(e, t) || "void 0";
        var s, a, l, c, d, u, p, f, h, v, m, g
    }

    function bn(e, t) {
        return e.staticProcessed = !0, t.staticRenderFns.push("with(this){return " + yn(e, t) + "}"), "_m(" + (t.staticRenderFns.length - 1) + (e.staticInFor ? ",true" : "") + ")"
    }

    function wn(e, t) {
        if (e.onceProcessed = !0, e.if && !e.ifProcessed) return xn(e, t);
        if (e.staticInFor) {
            for (var n = "", i = e.parent; i;) {
                if (i.for) {
                    n = i.key;
                    break
                }
                i = i.parent
            }
            return n ? "_o(" + yn(e, t) + "," + t.onceId++ + "," + n + ")" : yn(e, t)
        }
        return bn(e, t)
    }

    function xn(e, t, n, i) {
        return e.ifProcessed = !0,
            function e(t, n, i, o) {
                function r(e) {
                    return i ? i(e, n) : e.once ? wn(e, n) : yn(e, n)
                }
                if (!t.length) return o || "_e()";
                var s = t.shift();
                return s.exp ? "(" + s.exp + ")?" + r(s.block) + ":" + e(t, n, i, o) : "" + r(s.block)
            }(e.ifConditions.slice(), t, n, i)
    }

    function Cn(e, t) {
        var n, i, o = "{",
            r = function(e, t) {
                var n = e.directives;
                if (n) {
                    var i, o, r, s, a = "directives:[",
                        l = !1;
                    for (i = 0, o = n.length; i < o; i++) {
                        r = n[i], s = !0;
                        var c = t.directives[r.name];
                        c && (s = !!c(e, r, t.warn)), s && (l = !0, a += '{name:"' + r.name + '",rawName:"' + r.rawName + '"' + (r.value ? ",value:(" + r.value + "),expression:" + JSON.stringify(r.value) : "") + (r.arg ? ',arg:"' + r.arg + '"' : "") + (r.modifiers ? ",modifiers:" + JSON.stringify(r.modifiers) : "") + "},")
                    }
                    return l ? a.slice(0, -1) + "]" : void 0
                }
            }(e, t);
        r && (o += r + ","), e.key && (o += "key:" + e.key + ","), e.ref && (o += "ref:" + e.ref + ","), e.refInFor && (o += "refInFor:true,"), e.pre && (o += "pre:true,"), e.component && (o += 'tag:"' + e.tag + '",');
        for (var s = 0; s < t.dataGenFns.length; s++) o += t.dataGenFns[s](e);
        if (e.attrs && (o += "attrs:{" + Tn(e.attrs) + "},"), e.props && (o += "domProps:{" + Tn(e.props) + "},"), e.events && (o += hn(e.events, !1, t.warn) + ","), e.nativeEvents && (o += hn(e.nativeEvents, !0, t.warn) + ","), e.slotTarget && !e.slotScope && (o += "slot:" + e.slotTarget + ","), e.scopedSlots && (o += (n = e.scopedSlots, i = t, "scopedSlots:_u([" + Object.keys(n).map(function(e) {
                return $n(e, n[e], i)
            }).join(",") + "]),")), e.model && (o += "model:{value:" + e.model.value + ",callback:" + e.model.callback + ",expression:" + e.model.expression + "},"), e.inlineTemplate) {
            var a = function(e, t) {
                var n = e.children[0];
                if (1 === n.type) {
                    var i = gn(n, t.options);
                    return "inlineTemplate:{render:function(){" + i.render + "},staticRenderFns:[" + i.staticRenderFns.map(function(e) {
                        return "function(){" + e + "}"
                    }).join(",") + "]}"
                }
            }(e, t);
            a && (o += a + ",")
        }
        return o = o.replace(/,$/, "") + "}", e.wrapData && (o = e.wrapData(o)), e.wrapListeners && (o = e.wrapListeners(o)), o
    }

    function $n(e, t, n) {
        return t.for && !t.forProcessed ? (i = e, r = n, s = (o = t).for, a = o.alias, l = o.iterator1 ? "," + o.iterator1 : "", c = o.iterator2 ? "," + o.iterator2 : "", o.forProcessed = !0, "_l((" + s + "),function(" + a + l + c + "){return " + $n(i, o, r) + "})") : "{key:" + e + ",fn:function(" + String(t.slotScope) + "){return " + ("template" === t.tag ? t.if ? t.if+"?" + (kn(t, n) || "undefined") + ":undefined" : kn(t, n) || "undefined" : yn(t, n)) + "}}";
        var i, o, r, s, a, l, c
    }

    function kn(e, t, n, i, o) {
        var r = e.children;
        if (r.length) {
            var s = r[0];
            if (1 === r.length && s.for && "template" !== s.tag && "slot" !== s.tag) return (i || yn)(s, t);
            var a = n ? function(e, t) {
                    for (var n = 0, i = 0; i < e.length; i++) {
                        var o = e[i];
                        if (1 === o.type) {
                            if (Sn(o) || o.ifConditions && o.ifConditions.some(function(e) {
                                    return Sn(e.block)
                                })) {
                                n = 2;
                                break
                            }(t(o) || o.ifConditions && o.ifConditions.some(function(e) {
                                return t(e.block)
                            })) && (n = 1)
                        }
                    }
                    return n
                }(r, t.maybeComponent) : 0,
                l = o || _n;
            return "[" + r.map(function(e) {
                return l(e, t)
            }).join(",") + "]" + (a ? "," + a : "")
        }
    }

    function Sn(e) {
        return void 0 !== e.for || "template" === e.tag || "slot" === e.tag
    }

    function _n(e, t) {
        return 1 === e.type ? yn(e, t) : 3 === e.type && e.isComment ? (i = e, "_e(" + JSON.stringify(i.text) + ")") : "_v(" + (2 === (n = e).type ? n.expression : An(JSON.stringify(n.text))) + ")";
        var n, i
    }

    function Tn(e) {
        for (var t = "", n = 0; n < e.length; n++) {
            var i = e[n];
            t += '"' + i.name + '":' + An(i.value) + ","
        }
        return t.slice(0, -1)
    }

    function An(e) {
        return e.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")
    }

    function Dn(e, t) {
        try {
            return new Function(e)
        } catch (n) {
            return t.push({
                err: n,
                code: e
            }), m
        }
    }

    function En(e) {
        return (_s = _s || document.createElement("div")).innerHTML = e ? '<a href="\n"/>' : '<div a="\n"/>', 0 < _s.innerHTML.indexOf("&#10;")
    }
    var jn, On = Object.freeze({}),
        Mn = Object.prototype.toString,
        Ln = c("slot,component", !0),
        Pn = c("key,ref,slot,slot-scope,is"),
        Nn = Object.prototype.hasOwnProperty,
        In = /-(\w)/g,
        Bn = p(function(e) {
            return e.replace(In, function(e, t) {
                return t ? t.toUpperCase() : ""
            })
        }),
        Hn = p(function(e) {
            return e.charAt(0).toUpperCase() + e.slice(1)
        }),
        Rn = /\B([A-Z])/g,
        qn = p(function(e) {
            return e.replace(Rn, "-$1").toLowerCase()
        }),
        Fn = Function.prototype.bind ? function(e, t) {
            return e.bind(t)
        } : function(e, t) {
            function n(n) {
                var i = arguments.length;
                return i ? 1 < i ? e.apply(t, arguments) : e.call(t, n) : e.call(t)
            }
            return n._length = e.length, n
        },
        zn = function(e, t, n) {
            return !1
        },
        Wn = function(e) {
            return e
        },
        Un = "data-server-rendered",
        Vn = ["component", "directive", "filter"],
        Xn = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed", "activated", "deactivated", "errorCaptured"],
        Yn = {
            optionMergeStrategies: Object.create(null),
            silent: !1,
            productionTip: !1,
            devtools: !1,
            performance: !1,
            errorHandler: null,
            warnHandler: null,
            ignoredElements: [],
            keyCodes: Object.create(null),
            isReservedTag: zn,
            isReservedAttr: zn,
            isUnknownElement: zn,
            getTagNamespace: m,
            parsePlatformTagName: Wn,
            mustUseProp: zn,
            _lifecycleHooks: Xn
        },
        Jn = /[^\w.$]/,
        Kn = "__proto__" in {},
        Gn = "undefined" != typeof window,
        Qn = "undefined" != typeof WXEnvironment && !!WXEnvironment.platform,
        Zn = Qn && WXEnvironment.platform.toLowerCase(),
        ei = Gn && window.navigator.userAgent.toLowerCase(),
        ti = ei && /msie|trident/.test(ei),
        ni = ei && 0 < ei.indexOf("msie 9.0"),
        ii = ei && 0 < ei.indexOf("edge/"),
        oi = (ei && ei.indexOf("android"), ei && /iphone|ipad|ipod|ios/.test(ei) || "ios" === Zn),
        ri = (ei && /chrome\/\d+/.test(ei), {}.watch),
        si = !1;
    if (Gn) try {
        var ai = {};
        Object.defineProperty(ai, "passive", {
            get: function() {
                si = !0
            }
        }), window.addEventListener("test-passive", null, ai)
    } catch (p) {}
    var li, ci = function() {
            return void 0 === jn && (jn = !Gn && !Qn && "undefined" != typeof global && "server" === global.process.env.VUE_ENV), jn
        },
        di = Gn && window.__VUE_DEVTOOLS_GLOBAL_HOOK__,
        ui = "undefined" != typeof Symbol && x(Symbol) && "undefined" != typeof Reflect && x(Reflect.ownKeys);
    li = "undefined" != typeof Set && x(Set) ? Set : function() {
        function e() {
            this.set = Object.create(null)
        }
        return e.prototype.has = function(e) {
            return !0 === this.set[e]
        }, e.prototype.add = function(e) {
            this.set[e] = !0
        }, e.prototype.clear = function() {
            this.set = Object.create(null)
        }, e
    }();
    var pi = m,
        fi = 0,
        hi = function() {
            this.id = fi++, this.subs = []
        };
    hi.prototype.addSub = function(e) {
        this.subs.push(e)
    }, hi.prototype.removeSub = function(e) {
        d(this.subs, e)
    }, hi.prototype.depend = function() {
        hi.target && hi.target.addDep(this)
    }, hi.prototype.notify = function() {
        for (var e = this.subs.slice(), t = 0, n = e.length; t < n; t++) e[t].update()
    }, hi.target = null;
    var vi = [],
        mi = function(e, t, n, i, o, r, s, a) {
            this.tag = e, this.data = t, this.children = n, this.text = i, this.elm = o, this.ns = void 0, this.context = r, this.fnContext = void 0, this.fnOptions = void 0, this.fnScopeId = void 0, this.key = t && t.key, this.componentOptions = s, this.componentInstance = void 0, this.parent = void 0, this.raw = !1, this.isStatic = !1, this.isRootInsert = !0, this.isComment = !1, this.isCloned = !1, this.isOnce = !1, this.asyncFactory = a, this.asyncMeta = void 0, this.isAsyncPlaceholder = !1
        },
        gi = {
            child: {
                configurable: !0
            }
        };
    gi.child.get = function() {
        return this.componentInstance
    }, Object.defineProperties(mi.prototype, gi);
    var yi = function(e) {
            void 0 === e && (e = "");
            var t = new mi;
            return t.text = e, t.isComment = !0, t
        },
        bi = Array.prototype,
        wi = Object.create(bi);
    ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(function(e) {
        var t = bi[e];
        w(wi, e, function() {
            for (var n = [], i = arguments.length; i--;) n[i] = arguments[i];
            var o, r = t.apply(this, n),
                s = this.__ob__;
            switch (e) {
                case "push":
                case "unshift":
                    o = n;
                    break;
                case "splice":
                    o = n.slice(2)
            }
            return o && s.observeArray(o), s.dep.notify(), r
        })
    });
    var xi = Object.getOwnPropertyNames(wi),
        Ci = !0,
        $i = function(e) {
            this.value = e, this.dep = new hi, this.vmCount = 0, w(e, "__ob__", this), Array.isArray(e) ? ((Kn ? T : A)(e, wi, xi), this.observeArray(e)) : this.walk(e)
        };
    $i.prototype.walk = function(e) {
        for (var t = Object.keys(e), n = 0; n < t.length; n++) E(e, t[n])
    }, $i.prototype.observeArray = function(e) {
        for (var t = 0, n = e.length; t < n; t++) D(e[t])
    };
    var ki = Yn.optionMergeStrategies;
    ki.data = function(e, t, n) {
        return n ? L(e, t, n) : t && "function" != typeof t ? e : L(e, t)
    }, Xn.forEach(function(e) {
        ki[e] = P
    }), Vn.forEach(function(e) {
        ki[e + "s"] = N
    }), ki.watch = function(e, t, n, i) {
        if (e === ri && (e = void 0), t === ri && (t = void 0), !t) return Object.create(e || null);
        if (!e) return t;
        var o = {};
        for (var r in h(o, e), t) {
            var s = o[r],
                a = t[r];
            s && !Array.isArray(s) && (s = [s]), o[r] = s ? s.concat(a) : Array.isArray(a) ? a : [a]
        }
        return o
    }, ki.props = ki.methods = ki.inject = ki.computed = function(e, t, n, i) {
        if (!e) return t;
        var o = Object.create(null);
        return h(o, e), t && h(o, t), o
    }, ki.provide = L;
    var Si, _i, Ti = function(e, t) {
            return void 0 === t ? e : t
        },
        Ai = [],
        Di = !1,
        Ei = !1;
    if ("undefined" != typeof setImmediate && x(setImmediate)) _i = function() {
        setImmediate(V)
    };
    else if ("undefined" == typeof MessageChannel || !x(MessageChannel) && "[object MessageChannelConstructor]" !== MessageChannel.toString()) _i = function() {
        setTimeout(V, 0)
    };
    else {
        var ji = new MessageChannel,
            Oi = ji.port2;
        ji.port1.onmessage = V, _i = function() {
            Oi.postMessage(1)
        }
    }
    if ("undefined" != typeof Promise && x(Promise)) {
        var Mi = Promise.resolve();
        Si = function() {
            Mi.then(V), oi && setTimeout(m)
        }
    } else Si = _i;
    var Li, Pi = new li,
        Ni = p(function(e) {
            var t = "&" === e.charAt(0),
                n = "~" === (e = t ? e.slice(1) : e).charAt(0),
                i = "!" === (e = n ? e.slice(1) : e).charAt(0);
            return {
                name: e = i ? e.slice(1) : e,
                once: n,
                capture: i,
                passive: t
            }
        }),
        Ii = null,
        Bi = [],
        Hi = [],
        Ri = {},
        qi = !1,
        Fi = !1,
        zi = 0,
        Wi = 0,
        Ui = function(e, t, n, i, o) {
            this.vm = e, o && (e._watcher = this), e._watchers.push(this), i ? (this.deep = !!i.deep, this.user = !!i.user, this.lazy = !!i.lazy, this.sync = !!i.sync) : this.deep = this.user = this.lazy = this.sync = !1, this.cb = n, this.id = ++Wi, this.active = !0, this.dirty = this.lazy, this.deps = [], this.newDeps = [], this.depIds = new li, this.newDepIds = new li, this.expression = "", "function" == typeof t ? this.getter = t : (this.getter = function(e) {
                if (!Jn.test(e)) {
                    var t = e.split(".");
                    return function(e) {
                        for (var n = 0; n < t.length; n++) {
                            if (!e) return;
                            e = e[t[n]]
                        }
                        return e
                    }
                }
            }(t), this.getter || (this.getter = function() {})), this.value = this.lazy ? void 0 : this.get()
        };
    Ui.prototype.get = function() {
        var e;
        C(this);
        var t = this.vm;
        try {
            e = this.getter.call(t, t)
        } catch (e) {
            if (!this.user) throw e;
            z(e, t, 'getter for watcher "' + this.expression + '"')
        } finally {
            this.deep && Y(e), $(), this.cleanupDeps()
        }
        return e
    }, Ui.prototype.addDep = function(e) {
        var t = e.id;
        this.newDepIds.has(t) || (this.newDepIds.add(t), this.newDeps.push(e), this.depIds.has(t) || e.addSub(this))
    }, Ui.prototype.cleanupDeps = function() {
        for (var e = this.deps.length; e--;) {
            var t = this.deps[e];
            this.newDepIds.has(t.id) || t.removeSub(this)
        }
        var n = this.depIds;
        this.depIds = this.newDepIds, this.newDepIds = n, this.newDepIds.clear(), n = this.deps, this.deps = this.newDeps, this.newDeps = n, this.newDeps.length = 0
    }, Ui.prototype.update = function() {
        this.lazy ? this.dirty = !0 : this.sync ? this.run() : function(e) {
            var t = e.id;
            if (null == Ri[t]) {
                if (Ri[t] = !0, Fi) {
                    for (var n = Bi.length - 1; zi < n && Bi[n].id > e.id;) n--;
                    Bi.splice(n + 1, 0, e)
                } else Bi.push(e);
                qi || (qi = !0, X(fe))
            }
        }(this)
    }, Ui.prototype.run = function() {
        if (this.active) {
            var e = this.get();
            if (e !== this.value || o(e) || this.deep) {
                var t = this.value;
                if (this.value = e, this.user) try {
                    this.cb.call(this.vm, e, t)
                } catch (e) {
                    z(e, this.vm, 'callback for watcher "' + this.expression + '"')
                } else this.cb.call(this.vm, e, t)
            }
        }
    }, Ui.prototype.evaluate = function() {
        this.value = this.get(), this.dirty = !1
    }, Ui.prototype.depend = function() {
        for (var e = this.deps.length; e--;) this.deps[e].depend()
    }, Ui.prototype.teardown = function() {
        if (this.active) {
            this.vm._isBeingDestroyed || d(this.vm._watchers, this);
            for (var e = this.deps.length; e--;) this.deps[e].removeSub(this);
            this.active = !1
        }
    };
    var Vi = {
            enumerable: !0,
            configurable: !0,
            get: m,
            set: m
        },
        Xi = {
            lazy: !0
        };
    je(Oe.prototype);
    var Yi, Ji, Ki, Gi, Qi, Zi, eo, to = {
            init: function(e, n, i, o) {
                if (e.componentInstance && !e.componentInstance._isDestroyed && e.data.keepAlive) {
                    var r = e;
                    to.prepatch(r, r)
                } else(e.componentInstance = function(e, n, i, o) {
                    var r = {
                            _isComponent: !0,
                            parent: n,
                            _parentVnode: e,
                            _parentElm: i || null,
                            _refElm: o || null
                        },
                        s = e.data.inlineTemplate;
                    return t(s) && (r.render = s.render, r.staticRenderFns = s.staticRenderFns), new e.componentOptions.Ctor(r)
                }(e, Ii, i, o)).$mount(n ? e.elm : void 0, n)
            },
            prepatch: function(e, t) {
                var n = t.componentOptions;
                ! function(e, t, n, i, o) {
                    var r = !!(o || e.$options._renderChildren || i.data.scopedSlots || e.$scopedSlots !== On);
                    if (e.$options._parentVnode = i, e.$vnode = i, e._vnode && (e._vnode.parent = i), e.$options._renderChildren = o, e.$attrs = i.data.attrs || On, e.$listeners = n || On, t && e.$options.props) {
                        _(!1);
                        for (var s = e._props, a = e.$options._propKeys || [], l = 0; l < a.length; l++) {
                            var c = a[l],
                                d = e.$options.props;
                            s[c] = H(c, d, t, e)
                        }
                        _(!0), e.$options.propsData = t
                    }
                    n = n || On;
                    var u = e.$options._parentListeners;
                    e.$options._parentListeners = n, se(e, n, u), r && (e.$slots = ae(o, i.context), e.$forceUpdate())
                }(t.componentInstance = e.componentInstance, n.propsData, n.listeners, t, n.children)
            },
            insert: function(e) {
                var t, n = e.context,
                    i = e.componentInstance;
                i._isMounted || (i._isMounted = !0, pe(i, "mounted")), e.data.keepAlive && (n._isMounted ? ((t = i)._inactive = !1, Hi.push(t)) : ue(i, !0))
            },
            destroy: function(e) {
                var t = e.componentInstance;
                t._isDestroyed || (e.data.keepAlive ? function e(t, n) {
                    if (!(n && (t._directInactive = !0, de(t)) || t._inactive)) {
                        t._inactive = !0;
                        for (var i = 0; i < t.$children.length; i++) e(t.$children[i]);
                        pe(t, "deactivated")
                    }
                }(t, !0) : t.$destroy())
            }
        },
        no = Object.keys(to),
        io = 1,
        oo = 2,
        ro = 0;
    He.prototype._init = function(e) {
        var t, n, i, o, r = this;
        r._uid = ro++, r._isVue = !0, e && e._isComponent ? function(e, t) {
                var n = e.$options = Object.create(e.constructor.options),
                    i = t._parentVnode;
                n.parent = t.parent, n._parentVnode = i, n._parentElm = t._parentElm, n._refElm = t._refElm;
                var o = i.componentOptions;
                n.propsData = o.propsData, n._parentListeners = o.listeners, n._renderChildren = o.children, n._componentTag = o.tag, t.render && (n.render = t.render, n.staticRenderFns = t.staticRenderFns)
            }(r, e) : r.$options = I(Ie(r.constructor), e || {}, r),
            function(e) {
                var t = e.$options,
                    n = t.parent;
                if (n && !t.abstract) {
                    for (; n.$options.abstract && n.$parent;) n = n.$parent;
                    n.$children.push(e)
                }
                e.$parent = n, e.$root = n ? n.$root : e, e.$children = [], e.$refs = {}, e._watcher = null, e._inactive = null, e._directInactive = !1, e._isMounted = !1, e._isDestroyed = !1, e._isBeingDestroyed = !1
            }((r._renderProxy = r)._self = r),
            function(e) {
                e._events = Object.create(null), e._hasHookEvent = !1;
                var t = e.$options._parentListeners;
                t && se(e, t)
            }(r),
            function(e) {
                e._vnode = null, e._staticTrees = null;
                var t = e.$options,
                    n = e.$vnode = t._parentVnode,
                    i = n && n.context;
                e.$slots = ae(t._renderChildren, i), e.$scopedSlots = On, e._c = function(t, n, i, o) {
                    return Ne(e, t, n, i, o, !1)
                }, e.$createElement = function(t, n, i, o) {
                    return Ne(e, t, n, i, o, !0)
                };
                var o = n && n.data;
                E(e, "$attrs", o && o.attrs || On, null, !0), E(e, "$listeners", t._parentListeners || On, null, !0)
            }(r), pe(r, "beforeCreate"), (n = be((t = r).$options.inject, t)) && (_(!1), Object.keys(n).forEach(function(e) {
                E(t, e, n[e])
            }), _(!0)), ve(r), (o = (i = r).$options.provide) && (i._provided = "function" == typeof o ? o.call(i) : o), pe(r, "created"), r.$options.el && r.$mount(r.$options.el)
    }, Yi = He, Ji = {
        get: function() {
            return this._data
        }
    }, Ki = {
        get: function() {
            return this._props
        }
    }, Object.defineProperty(Yi.prototype, "$data", Ji), Object.defineProperty(Yi.prototype, "$props", Ki), Yi.prototype.$set = j, Yi.prototype.$delete = O, Yi.prototype.$watch = function(e, t, n) {
        if (r(t)) return ye(this, e, t, n);
        (n = n || {}).user = !0;
        var i = new Ui(this, e, t, n);
        return n.immediate && t.call(this, i.value),
            function() {
                i.teardown()
            }
    }, Qi = /^hook:/, (Gi = He).prototype.$on = function(e, t) {
        if (Array.isArray(e))
            for (var n = 0, i = e.length; n < i; n++) this.$on(e[n], t);
        else(this._events[e] || (this._events[e] = [])).push(t), Qi.test(e) && (this._hasHookEvent = !0);
        return this
    }, Gi.prototype.$once = function(e, t) {
        function n() {
            i.$off(e, n), t.apply(i, arguments)
        }
        var i = this;
        return n.fn = t, i.$on(e, n), i
    }, Gi.prototype.$off = function(e, t) {
        var n = this;
        if (!arguments.length) return n._events = Object.create(null), n;
        if (Array.isArray(e)) {
            for (var i = 0, o = e.length; i < o; i++) this.$off(e[i], t);
            return n
        }
        var r = n._events[e];
        if (!r) return n;
        if (!t) return n._events[e] = null, n;
        if (t)
            for (var s, a = r.length; a--;)
                if ((s = r[a]) === t || s.fn === t) {
                    r.splice(a, 1);
                    break
                }
        return n
    }, Gi.prototype.$emit = function(e) {
        var t = this,
            n = t._events[e];
        if (n) {
            n = 1 < n.length ? f(n) : n;
            for (var i = f(arguments, 1), o = 0, r = n.length; o < r; o++) try {
                n[o].apply(t, i)
            } catch (n) {
                z(n, t, 'event handler for "' + e + '"')
            }
        }
        return t
    }, (Zi = He).prototype._update = function(e, t) {
        var n = this;
        n._isMounted && pe(n, "beforeUpdate");
        var i = n.$el,
            o = n._vnode,
            r = Ii;
        (Ii = n)._vnode = e, o ? n.$el = n.__patch__(o, e) : (n.$el = n.__patch__(n.$el, e, t, !1, n.$options._parentElm, n.$options._refElm), n.$options._parentElm = n.$options._refElm = null), Ii = r, i && (i.__vue__ = null), n.$el && (n.$el.__vue__ = n), n.$vnode && n.$parent && n.$vnode === n.$parent._vnode && (n.$parent.$el = n.$el)
    }, Zi.prototype.$forceUpdate = function() {
        this._watcher && this._watcher.update()
    }, Zi.prototype.$destroy = function() {
        var e = this;
        if (!e._isBeingDestroyed) {
            pe(e, "beforeDestroy"), e._isBeingDestroyed = !0;
            var t = e.$parent;
            !t || t._isBeingDestroyed || e.$options.abstract || d(t.$children, e), e._watcher && e._watcher.teardown();
            for (var n = e._watchers.length; n--;) e._watchers[n].teardown();
            e._data.__ob__ && e._data.__ob__.vmCount--, e._isDestroyed = !0, e.__patch__(e._vnode, null), pe(e, "destroyed"), e.$off(), e.$el && (e.$el.__vue__ = null), e.$vnode && (e.$vnode.parent = null)
        }
    }, je((eo = He).prototype), eo.prototype.$nextTick = function(e) {
        return X(e, this)
    }, eo.prototype._render = function() {
        var e, t = this,
            n = t.$options,
            i = n.render,
            o = n._parentVnode;
        o && (t.$scopedSlots = o.data.scopedSlots || On), t.$vnode = o;
        try {
            e = i.call(t._renderProxy, t.$createElement)
        } catch (n) {
            z(n, t, "render"), e = t._vnode
        }
        return e instanceof mi || (e = yi()), e.parent = o, e
    };
    var so, ao, lo, co = [String, RegExp, Array],
        uo = {
            KeepAlive: {
                name: "keep-alive",
                abstract: !0,
                props: {
                    include: co,
                    exclude: co,
                    max: [String, Number]
                },
                created: function() {
                    this.cache = Object.create(null), this.keys = []
                },
                destroyed: function() {
                    for (var e in this.cache) ze(this.cache, e, this.keys)
                },
                mounted: function() {
                    var e = this;
                    this.$watch("include", function(t) {
                        Fe(e, function(e) {
                            return qe(t, e)
                        })
                    }), this.$watch("exclude", function(t) {
                        Fe(e, function(e) {
                            return !qe(t, e)
                        })
                    })
                },
                render: function() {
                    var e = this.$slots.default,
                        t = ie(e),
                        n = t && t.componentOptions;
                    if (n) {
                        var i = Re(n),
                            o = this.include,
                            r = this.exclude;
                        if (o && (!i || !qe(o, i)) || r && i && qe(r, i)) return t;
                        var s = this.cache,
                            a = this.keys,
                            l = null == t.key ? n.Ctor.cid + (n.tag ? "::" + n.tag : "") : t.key;
                        s[l] ? (t.componentInstance = s[l].componentInstance, d(a, l), a.push(l)) : (s[l] = t, a.push(l), this.max && a.length > parseInt(this.max) && ze(s, a[0], a, this._vnode)), t.data.keepAlive = !0
                    }
                    return t || e && e[0]
                }
            }
        };
    so = He, lo = {
            get: function() {
                return Yn
            }
        }, Object.defineProperty(so, "config", lo), so.util = {
            warn: pi,
            extend: h,
            mergeOptions: I,
            defineReactive: E
        }, so.set = j, so.delete = O, so.nextTick = X, so.options = Object.create(null), Vn.forEach(function(e) {
            so.options[e + "s"] = Object.create(null)
        }), h((so.options._base = so).options.components, uo), so.use = function(e) {
            var t = this._installedPlugins || (this._installedPlugins = []);
            if (-1 < t.indexOf(e)) return this;
            var n = f(arguments, 1);
            return n.unshift(this), "function" == typeof e.install ? e.install.apply(e, n) : "function" == typeof e && e.apply(null, n), t.push(e), this
        }, so.mixin = function(e) {
            return this.options = I(this.options, e), this
        },
        function(e) {
            e.cid = 0;
            var t = 1;
            e.extend = function(e) {
                e = e || {};
                var n = this,
                    i = n.cid,
                    o = e._Ctor || (e._Ctor = {});
                if (o[i]) return o[i];
                var r = e.name || n.options.name,
                    s = function(e) {
                        this._init(e)
                    };
                return ((s.prototype = Object.create(n.prototype)).constructor = s).cid = t++, s.options = I(n.options, e), s.super = n, s.options.props && function(e) {
                    var t = e.options.props;
                    for (var n in t) he(e.prototype, "_props", n)
                }(s), s.options.computed && function(e) {
                    var t = e.options.computed;
                    for (var n in t) me(e.prototype, n, t[n])
                }(s), s.extend = n.extend, s.mixin = n.mixin, s.use = n.use, Vn.forEach(function(e) {
                    s[e] = n[e]
                }), r && (s.options.components[r] = s), s.superOptions = n.options, s.extendOptions = e, s.sealedOptions = h({}, s.options), o[i] = s
            }
        }(so), ao = so, Vn.forEach(function(e) {
            ao[e] = function(t, n) {
                return n ? ("component" === e && r(n) && (n.name = n.name || t, n = this.options._base.extend(n)), "directive" === e && "function" == typeof n && (n = {
                    bind: n,
                    update: n
                }), this.options[e + "s"][t] = n) : this.options[e + "s"][t]
            }
        }), Object.defineProperty(He.prototype, "$isServer", {
            get: ci
        }), Object.defineProperty(He.prototype, "$ssrContext", {
            get: function() {
                return this.$vnode && this.$vnode.ssrContext
            }
        }), Object.defineProperty(He, "FunctionalRenderContext", {
            value: Oe
        }), He.version = "2.5.17";
    var po, fo, ho, vo, mo, go, yo, bo, wo = c("style,class"),
        xo = c("input,textarea,option,select,progress"),
        Co = function(e, t, n) {
            return "value" === n && xo(e) && "button" !== t || "selected" === n && "option" === e || "checked" === n && "input" === e || "muted" === n && "video" === e
        },
        $o = c("contenteditable,draggable,spellcheck"),
        ko = c("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),
        So = "http://www.w3.org/1999/xlink",
        _o = function(e) {
            return ":" === e.charAt(5) && "xlink" === e.slice(0, 5)
        },
        To = function(e) {
            return _o(e) ? e.slice(6, e.length) : ""
        },
        Ao = function(e) {
            return null == e || !1 === e
        },
        Do = {
            svg: "http://www.w3.org/2000/svg",
            math: "http://www.w3.org/1998/Math/MathML"
        },
        Eo = c("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot"),
        jo = c("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view", !0),
        Oo = function(e) {
            return Eo(e) || jo(e)
        },
        Mo = Object.create(null),
        Lo = c("text,number,password,search,email,tel,url"),
        Po = Object.freeze({
            createElement: function(e, t) {
                var n = document.createElement(e);
                return "select" !== e || t.data && t.data.attrs && void 0 !== t.data.attrs.multiple && n.setAttribute("multiple", "multiple"), n
            },
            createElementNS: function(e, t) {
                return document.createElementNS(Do[e], t)
            },
            createTextNode: function(e) {
                return document.createTextNode(e)
            },
            createComment: function(e) {
                return document.createComment(e)
            },
            insertBefore: function(e, t, n) {
                e.insertBefore(t, n)
            },
            removeChild: function(e, t) {
                e.removeChild(t)
            },
            appendChild: function(e, t) {
                e.appendChild(t)
            },
            parentNode: function(e) {
                return e.parentNode
            },
            nextSibling: function(e) {
                return e.nextSibling
            },
            tagName: function(e) {
                return e.tagName
            },
            setTextContent: function(e, t) {
                e.textContent = t
            },
            setStyleScope: function(e, t) {
                e.setAttribute(t, "")
            }
        }),
        No = {
            create: function(e, t) {
                Ke(t)
            },
            update: function(e, t) {
                e.data.ref !== t.data.ref && (Ke(e, !0), Ke(t))
            },
            destroy: function(e) {
                Ke(e, !0)
            }
        },
        Io = new mi("", {}, []),
        Bo = ["create", "activate", "update", "remove", "destroy"],
        Ho = {
            create: Ze,
            update: Ze,
            destroy: function(e) {
                Ze(e, Io)
            }
        },
        Ro = Object.create(null),
        qo = [No, Ho],
        Fo = {
            create: nt,
            update: nt
        },
        zo = {
            create: rt,
            update: rt
        },
        Wo = /[\w).+\-_$\]]/,
        Uo = "__r",
        Vo = "__c",
        Xo = {
            create: St,
            update: St
        },
        Yo = {
            create: _t,
            update: _t
        },
        Jo = p(function(e) {
            var t = {},
                n = /:(.+)/;
            return e.split(/;(?![^(]*\))/g).forEach(function(e) {
                if (e) {
                    var i = e.split(n);
                    1 < i.length && (t[i[0].trim()] = i[1].trim())
                }
            }), t
        }),
        Ko = /^--/,
        Go = /\s*!important$/,
        Qo = function(e, t, n) {
            if (Ko.test(t)) e.style.setProperty(t, n);
            else if (Go.test(n)) e.style.setProperty(t, n.replace(Go, ""), "important");
            else {
                var i = er(t);
                if (Array.isArray(n))
                    for (var o = 0, r = n.length; o < r; o++) e.style[i] = n[o];
                else e.style[i] = n
            }
        },
        Zo = ["Webkit", "Moz", "ms"],
        er = p(function(e) {
            if (bo = bo || document.createElement("div").style, "filter" !== (e = Bn(e)) && e in bo) return e;
            for (var t = e.charAt(0).toUpperCase() + e.slice(1), n = 0; n < Zo.length; n++) {
                var i = Zo[n] + t;
                if (i in bo) return i
            }
        }),
        tr = {
            create: Dt,
            update: Dt
        },
        nr = p(function(e) {
            return {
                enterClass: e + "-enter",
                enterToClass: e + "-enter-to",
                enterActiveClass: e + "-enter-active",
                leaveClass: e + "-leave",
                leaveToClass: e + "-leave-to",
                leaveActiveClass: e + "-leave-active"
            }
        }),
        ir = Gn && !ni,
        or = "transition",
        rr = "animation",
        sr = "transition",
        ar = "transitionend",
        lr = "animation",
        cr = "animationend";
    ir && (void 0 === window.ontransitionend && void 0 !== window.onwebkittransitionend && (sr = "WebkitTransition", ar = "webkitTransitionEnd"), void 0 === window.onanimationend && void 0 !== window.onwebkitanimationend && (lr = "WebkitAnimation", cr = "webkitAnimationEnd"));
    var dr = Gn ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout : function(e) {
            return e()
        },
        ur = /\b(transform|all)(,|$)/,
        pr = function(o) {
            function r(e) {
                var n = T.parentNode(e);
                t(n) && T.removeChild(n, e)
            }

            function s(e, i, o, r, s, c, u) {
                if (t(e.elm) && t(c) && (e = c[u] = S(e)), e.isRootInsert = !s, ! function(e, i, o, r) {
                        var s = e.data;
                        if (t(s)) {
                            var c = t(e.componentInstance) && s.keepAlive;
                            if (t(s = s.hook) && t(s = s.init) && s(e, !1, o, r), t(e.componentInstance)) return a(e, i), n(c) && function(e, n, i, o) {
                                for (var r, s = e; s.componentInstance;)
                                    if (s = s.componentInstance._vnode, t(r = s.data) && t(r = r.transition)) {
                                        for (r = 0; r < k.activate.length; ++r) k.activate[r](Io, s);
                                        n.push(s);
                                        break
                                    }
                                l(i, e.elm, o)
                            }(e, i, o, r), !0
                        }
                    }(e, i, o, r)) {
                    var h = e.data,
                        v = e.children,
                        m = e.tag;
                    t(m) ? (e.elm = e.ns ? T.createElementNS(e.ns, m) : T.createElement(m, e), f(e), d(e, v, i), t(h) && p(e, i)) : n(e.isComment) ? e.elm = T.createComment(e.text) : e.elm = T.createTextNode(e.text), l(o, e.elm, r)
                }
            }

            function a(e, n) {
                t(e.data.pendingInsert) && (n.push.apply(n, e.data.pendingInsert), e.data.pendingInsert = null), e.elm = e.componentInstance.$el, u(e) ? (p(e, n), f(e)) : (Ke(e), n.push(e))
            }

            function l(e, n, i) {
                t(e) && (t(i) ? i.parentNode === e && T.insertBefore(e, n, i) : T.appendChild(e, n))
            }

            function d(e, t, n) {
                if (Array.isArray(t))
                    for (var o = 0; o < t.length; ++o) s(t[o], n, e.elm, null, !0, t, o);
                else i(e.text) && T.appendChild(e.elm, T.createTextNode(String(e.text)))
            }

            function u(e) {
                for (; e.componentInstance;) e = e.componentInstance._vnode;
                return t(e.tag)
            }

            function p(e, n) {
                for (var i = 0; i < k.create.length; ++i) k.create[i](Io, e);
                t(C = e.data.hook) && (t(C.create) && C.create(Io, e), t(C.insert) && n.push(e))
            }

            function f(e) {
                var n;
                if (t(n = e.fnScopeId)) T.setStyleScope(e.elm, n);
                else
                    for (var i = e; i;) t(n = i.context) && t(n = n.$options._scopeId) && T.setStyleScope(e.elm, n), i = i.parent;
                t(n = Ii) && n !== e.context && n !== e.fnContext && t(n = n.$options._scopeId) && T.setStyleScope(e.elm, n)
            }

            function h(e, t, n, i, o, r) {
                for (; i <= o; ++i) s(n[i], r, e, t, !1, n, i)
            }

            function v(e) {
                var n, i, o = e.data;
                if (t(o))
                    for (t(n = o.hook) && t(n = n.destroy) && n(e), n = 0; n < k.destroy.length; ++n) k.destroy[n](e);
                if (t(n = e.children))
                    for (i = 0; i < e.children.length; ++i) v(e.children[i])
            }

            function m(e, n, i, o) {
                for (; i <= o; ++i) {
                    var s = n[i];
                    t(s) && (t(s.tag) ? (g(s), v(s)) : r(s.elm))
                }
            }

            function g(e, n) {
                if (t(n) || t(e.data)) {
                    var i, o = k.remove.length + 1;
                    for (t(n) ? n.listeners += o : n = function(e, t) {
                            function n() {
                                0 == --n.listeners && r(e)
                            }
                            return n.listeners = t, n
                        }(e.elm, o), t(i = e.componentInstance) && t(i = i._vnode) && t(i.data) && g(i, n), i = 0; i < k.remove.length; ++i) k.remove[i](e, n);
                    t(i = e.data.hook) && t(i = i.remove) ? i(e, n) : n()
                } else r(e.elm)
            }

            function y(e, n, i, o) {
                for (var r = i; r < o; r++) {
                    var s = n[r];
                    if (t(s) && Ge(e, s)) return r
                }
            }

            function b(i, o, r, a) {
                if (i !== o) {
                    var l = o.elm = i.elm;
                    if (n(i.isAsyncPlaceholder)) t(o.asyncFactory.resolved) ? x(i.elm, o, r) : o.isAsyncPlaceholder = !0;
                    else if (n(o.isStatic) && n(i.isStatic) && o.key === i.key && (n(o.isCloned) || n(o.isOnce))) o.componentInstance = i.componentInstance;
                    else {
                        var c, d = o.data;
                        t(d) && t(c = d.hook) && t(c = c.prepatch) && c(i, o);
                        var p = i.children,
                            f = o.children;
                        if (t(d) && u(o)) {
                            for (c = 0; c < k.update.length; ++c) k.update[c](i, o);
                            t(c = d.hook) && t(c = c.update) && c(i, o)
                        }
                        e(o.text) ? t(p) && t(f) ? p !== f && function(n, i, o, r, a) {
                            for (var l, c, d, u = 0, p = 0, f = i.length - 1, v = i[0], g = i[f], w = o.length - 1, x = o[0], C = o[w], $ = !a; u <= f && p <= w;) e(v) ? v = i[++u] : e(g) ? g = i[--f] : Ge(v, x) ? (b(v, x, r), v = i[++u], x = o[++p]) : Ge(g, C) ? (b(g, C, r), g = i[--f], C = o[--w]) : Ge(v, C) ? (b(v, C, r), $ && T.insertBefore(n, v.elm, T.nextSibling(g.elm)), v = i[++u], C = o[--w]) : (Ge(g, x) ? (b(g, x, r), $ && T.insertBefore(n, g.elm, v.elm), g = i[--f]) : (e(l) && (l = Qe(i, u, f)), e(c = t(x.key) ? l[x.key] : y(x, i, u, f)) ? s(x, r, n, v.elm, !1, o, p) : Ge(d = i[c], x) ? (b(d, x, r), i[c] = void 0, $ && T.insertBefore(n, d.elm, v.elm)) : s(x, r, n, v.elm, !1, o, p)), x = o[++p]);
                            f < u ? h(n, e(o[w + 1]) ? null : o[w + 1].elm, o, p, w, r) : w < p && m(0, i, u, f)
                        }(l, p, f, r, a) : t(f) ? (t(i.text) && T.setTextContent(l, ""), h(l, null, f, 0, f.length - 1, r)) : t(p) ? m(0, p, 0, p.length - 1) : t(i.text) && T.setTextContent(l, "") : i.text !== o.text && T.setTextContent(l, o.text), t(d) && t(c = d.hook) && t(c = c.postpatch) && c(i, o)
                    }
                }
            }

            function w(e, i, o) {
                if (n(o) && t(e.parent)) e.parent.data.pendingInsert = i;
                else
                    for (var r = 0; r < i.length; ++r) i[r].data.hook.insert(i[r])
            }

            function x(e, i, o, r) {
                var s, l = i.tag,
                    c = i.data,
                    u = i.children;
                if (r = r || c && c.pre, i.elm = e, n(i.isComment) && t(i.asyncFactory)) return i.isAsyncPlaceholder = !0;
                if (t(c) && (t(s = c.hook) && t(s = s.init) && s(i, !0), t(s = i.componentInstance))) return a(i, o), !0;
                if (t(l)) {
                    if (t(u))
                        if (e.hasChildNodes())
                            if (t(s = c) && t(s = s.domProps) && t(s = s.innerHTML)) {
                                if (s !== e.innerHTML) return !1
                            } else {
                                for (var f = !0, h = e.firstChild, v = 0; v < u.length; v++) {
                                    if (!h || !x(h, u[v], o, r)) {
                                        f = !1;
                                        break
                                    }
                                    h = h.nextSibling
                                }
                                if (!f || h) return !1
                            } else d(i, u, o);
                    if (t(c)) {
                        var m = !1;
                        for (var g in c)
                            if (!A(g)) {
                                m = !0, p(i, o);
                                break
                            }!m && c.class && Y(c.class)
                    }
                } else e.data !== i.text && (e.data = i.text);
                return !0
            }
            var C, $, k = {},
                _ = o.modules,
                T = o.nodeOps;
            for (C = 0; C < Bo.length; ++C)
                for (k[Bo[C]] = [], $ = 0; $ < _.length; ++$) t(_[$][Bo[C]]) && k[Bo[C]].push(_[$][Bo[C]]);
            var A = c("attrs,class,staticClass,staticStyle,key");
            return function(i, o, r, a, l, c) {
                if (!e(o)) {
                    var d, p = !1,
                        f = [];
                    if (e(i)) p = !0, s(o, f, l, c);
                    else {
                        var h = t(i.nodeType);
                        if (!h && Ge(i, o)) b(i, o, f, a);
                        else {
                            if (h) {
                                if (1 === i.nodeType && i.hasAttribute(Un) && (i.removeAttribute(Un), r = !0), n(r) && x(i, o, f)) return w(o, f, !0), i;
                                d = i, i = new mi(T.tagName(d).toLowerCase(), {}, [], void 0, d)
                            }
                            var g = i.elm,
                                y = T.parentNode(g);
                            if (s(o, f, g._leaveCb ? null : y, T.nextSibling(g)), t(o.parent))
                                for (var C = o.parent, $ = u(o); C;) {
                                    for (var S = 0; S < k.destroy.length; ++S) k.destroy[S](C);
                                    if (C.elm = o.elm, $) {
                                        for (var _ = 0; _ < k.create.length; ++_) k.create[_](Io, C);
                                        var A = C.data.hook.insert;
                                        if (A.merged)
                                            for (var D = 1; D < A.fns.length; D++) A.fns[D]()
                                    } else Ke(C);
                                    C = C.parent
                                }
                            t(y) ? m(0, [i], 0, 0) : t(i.tag) && v(i)
                        }
                    }
                    return w(o, f, p), o.elm
                }
                t(i) && v(i)
            }
        }({
            nodeOps: Po,
            modules: [Fo, zo, Xo, Yo, tr, Gn ? {
                create: Wt,
                activate: Wt,
                remove: function(e, t) {
                    !0 !== e.data.show ? qt(e, t) : t()
                }
            } : {}].concat(qo)
        });
    ni && document.addEventListener("selectionchange", function() {
        var e = document.activeElement;
        e && e.vmodel && Gt(e, "input")
    });
    var fr = {
            inserted: function(e, t, n, i) {
                "select" === n.tag ? (i.elm && !i.elm._vOptions ? G(n, "postpatch", function() {
                    fr.componentUpdated(e, t, n)
                }) : Ut(e, t, n.context), e._vOptions = [].map.call(e.options, Yt)) : ("textarea" === n.tag || Lo(e.type)) && (e._vModifiers = t.modifiers, t.modifiers.lazy || (e.addEventListener("compositionstart", Jt), e.addEventListener("compositionend", Kt), e.addEventListener("change", Kt), ni && (e.vmodel = !0)))
            },
            componentUpdated: function(e, t, n) {
                if ("select" === n.tag) {
                    Ut(e, t, n.context);
                    var i = e._vOptions,
                        o = e._vOptions = [].map.call(e.options, Yt);
                    o.some(function(e, t) {
                        return !g(e, i[t])
                    }) && (e.multiple ? t.value.some(function(e) {
                        return Xt(e, o)
                    }) : t.value !== t.oldValue && Xt(t.value, o)) && Gt(e, "change")
                }
            }
        },
        hr = {
            model: fr,
            show: {
                bind: function(e, t, n) {
                    var i = t.value,
                        o = (n = Qt(n)).data && n.data.transition,
                        r = e.__vOriginalDisplay = "none" === e.style.display ? "" : e.style.display;
                    i && o ? (n.data.show = !0, Rt(n, function() {
                        e.style.display = r
                    })) : e.style.display = i ? r : "none"
                },
                update: function(e, t, n) {
                    var i = t.value;
                    !i != !t.oldValue && ((n = Qt(n)).data && n.data.transition ? (n.data.show = !0, i ? Rt(n, function() {
                        e.style.display = e.__vOriginalDisplay
                    }) : qt(n, function() {
                        e.style.display = "none"
                    })) : e.style.display = i ? e.__vOriginalDisplay : "none")
                },
                unbind: function(e, t, n, i, o) {
                    o || (e.style.display = e.__vOriginalDisplay)
                }
            }
        },
        vr = {
            name: String,
            appear: Boolean,
            css: Boolean,
            mode: String,
            type: String,
            enterClass: String,
            leaveClass: String,
            enterToClass: String,
            leaveToClass: String,
            enterActiveClass: String,
            leaveActiveClass: String,
            appearClass: String,
            appearActiveClass: String,
            appearToClass: String,
            duration: [Number, String, Object]
        },
        mr = {
            name: "transition",
            props: vr,
            abstract: !0,
            render: function(e) {
                var t = this,
                    n = this.$slots.default;
                if (n && (n = n.filter(function(e) {
                        return e.tag || ne(e)
                    })).length) {
                    var o = this.mode,
                        r = n[0];
                    if (function(e) {
                            for (; e = e.parent;)
                                if (e.data.transition) return !0
                        }(this.$vnode)) return r;
                    var s = Zt(r);
                    if (!s) return r;
                    if (this._leaving) return tn(e, r);
                    var a = "__transition-" + this._uid + "-";
                    s.key = null == s.key ? s.isComment ? a + "comment" : a + s.tag : i(s.key) ? 0 === String(s.key).indexOf(a) ? s.key : a + s.key : s.key;
                    var l, c, d = (s.data || (s.data = {})).transition = en(this),
                        u = this._vnode,
                        p = Zt(u);
                    if (s.data.directives && s.data.directives.some(function(e) {
                            return "show" === e.name
                        }) && (s.data.show = !0), p && p.data && (l = s, (c = p).key !== l.key || c.tag !== l.tag) && !ne(p) && (!p.componentInstance || !p.componentInstance._vnode.isComment)) {
                        var f = p.data.transition = h({}, d);
                        if ("out-in" === o) return this._leaving = !0, G(f, "afterLeave", function() {
                            t._leaving = !1, t.$forceUpdate()
                        }), tn(e, r);
                        if ("in-out" === o) {
                            if (ne(s)) return u;
                            var v, m = function() {
                                v()
                            };
                            G(d, "afterEnter", m), G(d, "enterCancelled", m), G(f, "delayLeave", function(e) {
                                v = e
                            })
                        }
                    }
                    return r
                }
            }
        },
        gr = h({
            tag: String,
            moveClass: String
        }, vr);
    delete gr.mode;
    var yr = {
        Transition: mr,
        TransitionGroup: {
            props: gr,
            render: function(e) {
                for (var t = this.tag || this.$vnode.data.tag || "span", n = Object.create(null), i = this.prevChildren = this.children, o = this.$slots.default || [], r = this.children = [], s = en(this), a = 0; a < o.length; a++) {
                    var l = o[a];
                    l.tag && null != l.key && 0 !== String(l.key).indexOf("__vlist") && (r.push(l), ((n[l.key] = l).data || (l.data = {})).transition = s)
                }
                if (i) {
                    for (var c = [], d = [], u = 0; u < i.length; u++) {
                        var p = i[u];
                        p.data.transition = s, p.data.pos = p.elm.getBoundingClientRect(), n[p.key] ? c.push(p) : d.push(p)
                    }
                    this.kept = e(t, null, c), this.removed = d
                }
                return e(t, null, r)
            },
            beforeUpdate: function() {
                this.__patch__(this._vnode, this.kept, !1, !0), this._vnode = this.kept
            },
            updated: function() {
                var e = this.prevChildren,
                    t = this.moveClass || (this.name || "v") + "-move";
                e.length && this.hasMove(e[0].elm, t) && (e.forEach(nn), e.forEach(on), e.forEach(rn), this._reflow = document.body.offsetHeight, e.forEach(function(e) {
                    if (e.data.moved) {
                        var n = e.elm,
                            i = n.style;
                        Lt(n, t), i.transform = i.WebkitTransform = i.transitionDuration = "", n.addEventListener(ar, n._moveCb = function e(i) {
                            i && !/transform$/.test(i.propertyName) || (n.removeEventListener(ar, e), n._moveCb = null, Pt(n, t))
                        })
                    }
                }))
            },
            methods: {
                hasMove: function(e, t) {
                    if (!ir) return !1;
                    if (this._hasMove) return this._hasMove;
                    var n = e.cloneNode();
                    e._transitionClasses && e._transitionClasses.forEach(function(e) {
                        jt(n, e)
                    }), Et(n, t), n.style.display = "none", this.$el.appendChild(n);
                    var i = It(n);
                    return this.$el.removeChild(n), this._hasMove = i.hasTransform
                }
            }
        }
    };
    He.config.mustUseProp = Co, He.config.isReservedTag = Oo, He.config.isReservedAttr = wo, He.config.getTagNamespace = Ye, He.config.isUnknownElement = function(e) {
        if (!Gn) return !0;
        if (Oo(e)) return !1;
        if (e = e.toLowerCase(), null != Mo[e]) return Mo[e];
        var t = document.createElement(e);
        return -1 < e.indexOf("-") ? Mo[e] = t.constructor === window.HTMLUnknownElement || t.constructor === window.HTMLElement : Mo[e] = /HTMLUnknownElement/.test(t.toString())
    }, h(He.options.directives, hr), h(He.options.components, yr), He.prototype.__patch__ = Gn ? pr : m, He.prototype.$mount = function(e, t) {
        return e = e && Gn ? Je(e) : void 0, i = e, o = t, (n = this).$el = i, n.$options.render || (n.$options.render = yi), pe(n, "beforeMount"), new Ui(n, function() {
            n._update(n._render(), o)
        }, m, null, !0), o = !1, null == n.$vnode && (n._isMounted = !0, pe(n, "mounted")), n;
        var n, i, o
    }, Gn && setTimeout(function() {
        Yn.devtools && di && di.emit("init", He)
    }, 0);
    var br, wr = /\{\{((?:.|\n)+?)\}\}/g,
        xr = /[-.*+?^${}()|[\]\/\\]/g,
        Cr = p(function(e) {
            var t = e[0].replace(xr, "\\$&"),
                n = e[1].replace(xr, "\\$&");
            return new RegExp(t + "((?:.|\\n)+?)" + n, "g")
        }),
        $r = {
            staticKeys: ["staticClass"],
            transformNode: function(e, t) {
                t.warn;
                var n = vt(e, "class");
                n && (e.staticClass = JSON.stringify(n));
                var i = ht(e, "class", !1);
                i && (e.classBinding = i)
            },
            genData: function(e) {
                var t = "";
                return e.staticClass && (t += "staticClass:" + e.staticClass + ","), e.classBinding && (t += "class:" + e.classBinding + ","), t
            }
        },
        kr = {
            staticKeys: ["staticStyle"],
            transformNode: function(e, t) {
                t.warn;
                var n = vt(e, "style");
                n && (e.staticStyle = JSON.stringify(Jo(n)));
                var i = ht(e, "style", !1);
                i && (e.styleBinding = i)
            },
            genData: function(e) {
                var t = "";
                return e.staticStyle && (t += "staticStyle:" + e.staticStyle + ","), e.styleBinding && (t += "style:(" + e.styleBinding + "),"), t
            }
        },
        Sr = function(e) {
            return (br = br || document.createElement("div")).innerHTML = e, br.textContent
        },
        _r = c("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr"),
        Tr = c("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source"),
        Ar = c("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track"),
        Dr = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,
        Er = "[a-zA-Z_][\\w\\-\\.]*",
        jr = "((?:" + Er + "\\:)?" + Er + ")",
        Or = new RegExp("^<" + jr),
        Mr = /^\s*(\/?)>/,
        Lr = new RegExp("^<\\/" + jr + "[^>]*>"),
        Pr = /^<!DOCTYPE [^>]+>/i,
        Nr = /^<!\--/,
        Ir = /^<!\[/,
        Br = !1;
    "x".replace(/x(.)?/g, function(e, t) {
        Br = "" === t
    });
    var Hr, Rr, qr, Fr, zr, Wr, Ur, Vr, Xr, Yr, Jr, Kr = c("script,style,textarea", !0),
        Gr = {},
        Qr = {
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"',
            "&amp;": "&",
            "&#10;": "\n",
            "&#9;": "\t"
        },
        Zr = /&(?:lt|gt|quot|amp);/g,
        es = /&(?:lt|gt|quot|amp|#10|#9);/g,
        ts = c("pre,textarea", !0),
        ns = function(e, t) {
            return e && ts(e) && "\n" === t[0]
        },
        is = /^@|^v-on:/,
        os = /^v-|^@|^:/,
        rs = /([^]*?)\s+(?:in|of)\s+([^]*)/,
        ss = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
        as = /^\(|\)$/g,
        ls = /:(.*)$/,
        cs = /^:|^v-bind:/,
        ds = /\.[^.]+/g,
        us = p(Sr),
        ps = /^xmlns:NS\d+/,
        fs = /^NS\d+:/,
        hs = [$r, kr, {
            preTransformNode: function(e, t) {
                if ("input" === e.tag) {
                    var n, i = e.attrsMap;
                    if (!i["v-model"]) return;
                    if ((i[":type"] || i["v-bind:type"]) && (n = ht(e, "type")), i.type || n || !i["v-bind"] || (n = "(" + i["v-bind"] + ").type"), n) {
                        var o = vt(e, "v-if", !0),
                            r = o ? "&&(" + o + ")" : "",
                            s = null != vt(e, "v-else", !0),
                            a = vt(e, "v-else-if", !0),
                            l = pn(e);
                        cn(l), pt(l, "type", "checkbox"), ln(l, t), l.processed = !0, l.if = "(" + n + ")==='checkbox'" + r, dn(l, {
                            exp: l.if,
                            block: l
                        });
                        var c = pn(e);
                        vt(c, "v-for", !0), pt(c, "type", "radio"), ln(c, t), dn(l, {
                            exp: "(" + n + ")==='radio'" + r,
                            block: c
                        });
                        var d = pn(e);
                        return vt(d, "v-for", !0), pt(d, ":type", n), ln(d, t), dn(l, {
                            exp: o,
                            block: d
                        }), s ? l.else = !0 : a && (l.elseif = a), l
                    }
                }
            }
        }],
        vs = {
            expectHTML: !0,
            modules: hs,
            directives: {
                model: function(e, t, n) {
                    var i, o, r, s, a, l, c, d, u, p, f, h, v, m, g, y, b = t.value,
                        w = t.modifiers,
                        x = e.tag,
                        C = e.attrsMap.type;
                    if (e.component) return mt(e, b, w), !1;
                    if ("select" === x) v = e, m = b, y = (y = 'var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return ' + ((g = w) && g.number ? "_n(val)" : "val") + "});") + " " + gt(m, "$event.target.multiple ? $$selectedVal : $$selectedVal[0]"), ft(v, "change", y, null, !0);
                    else if ("input" === x && "checkbox" === C) l = e, c = b, u = (d = w) && d.number, p = ht(l, "value") || "null", f = ht(l, "true-value") || "true", h = ht(l, "false-value") || "false", dt(l, "checked", "Array.isArray(" + c + ")?_i(" + c + "," + p + ")>-1" + ("true" === f ? ":(" + c + ")" : ":_q(" + c + "," + f + ")")), ft(l, "change", "var $$a=" + c + ",$$el=$event.target,$$c=$$el.checked?(" + f + "):(" + h + ");if(Array.isArray($$a)){var $$v=" + (u ? "_n(" + p + ")" : p) + ",$$i=_i($$a,$$v);if($$el.checked){$$i<0&&(" + gt(c, "$$a.concat([$$v])") + ")}else{$$i>-1&&(" + gt(c, "$$a.slice(0,$$i).concat($$a.slice($$i+1))") + ")}}else{" + gt(c, "$$c") + "}", null, !0);
                    else if ("input" === x && "radio" === C) i = e, o = b, s = (r = w) && r.number, a = ht(i, "value") || "null", dt(i, "checked", "_q(" + o + "," + (a = s ? "_n(" + a + ")" : a) + ")"), ft(i, "change", gt(o, a), null, !0);
                    else if ("input" === x || "textarea" === x) ! function(e, t, n) {
                        var i = e.attrsMap.type,
                            o = n || {},
                            r = o.lazy,
                            s = o.number,
                            a = o.trim,
                            l = !r && "range" !== i,
                            c = r ? "change" : "range" === i ? Uo : "input",
                            d = "$event.target.value";
                        a && (d = "$event.target.value.trim()"), s && (d = "_n(" + d + ")");
                        var u = gt(t, d);
                        l && (u = "if($event.target.composing)return;" + u), dt(e, "value", "(" + t + ")"), ft(e, c, u, null, !0), (a || s) && ft(e, "blur", "$forceUpdate()")
                    }(e, b, w);
                    else if (!Yn.isReservedTag(x)) return mt(e, b, w), !1;
                    return !0
                },
                text: function(e, t) {
                    t.value && dt(e, "textContent", "_s(" + t.value + ")")
                },
                html: function(e, t) {
                    t.value && dt(e, "innerHTML", "_s(" + t.value + ")")
                }
            },
            isPreTag: function(e) {
                return "pre" === e
            },
            isUnaryTag: _r,
            mustUseProp: Co,
            canBeLeftOpenTag: Tr,
            isReservedTag: Oo,
            getTagNamespace: Ye,
            staticKeys: (Xr = hs, Xr.reduce(function(e, t) {
                return e.concat(t.staticKeys || [])
            }, []).join(","))
        },
        ms = p(function(e) {
            return c("type,tag,attrsList,attrsMap,plain,parent,children,attrs" + (e ? "," + e : ""))
        }),
        gs = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/,
        ys = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,
        bs = {
            esc: 27,
            tab: 9,
            enter: 13,
            space: 32,
            up: 38,
            left: 37,
            right: 39,
            down: 40,
            delete: [8, 46]
        },
        ws = {
            esc: "Escape",
            tab: "Tab",
            enter: "Enter",
            space: " ",
            up: ["Up", "ArrowUp"],
            left: ["Left", "ArrowLeft"],
            right: ["Right", "ArrowRight"],
            down: ["Down", "ArrowDown"],
            delete: ["Backspace", "Delete"]
        },
        xs = function(e) {
            return "if(" + e + ")return null;"
        },
        Cs = {
            stop: "$event.stopPropagation();",
            prevent: "$event.preventDefault();",
            self: xs("$event.target !== $event.currentTarget"),
            ctrl: xs("!$event.ctrlKey"),
            shift: xs("!$event.shiftKey"),
            alt: xs("!$event.altKey"),
            meta: xs("!$event.metaKey"),
            left: xs("'button' in $event && $event.button !== 0"),
            middle: xs("'button' in $event && $event.button !== 1"),
            right: xs("'button' in $event && $event.button !== 2")
        },
        $s = {
            on: function(e, t) {
                e.wrapListeners = function(e) {
                    return "_g(" + e + "," + t.value + ")"
                }
            },
            bind: function(e, t) {
                e.wrapData = function(n) {
                    return "_b(" + n + ",'" + e.tag + "'," + t.value + "," + (t.modifiers && t.modifiers.prop ? "true" : "false") + (t.modifiers && t.modifiers.sync ? ",true" : "") + ")"
                }
            },
            cloak: m
        },
        ks = function(e) {
            this.options = e, this.warn = e.warn || lt, this.transforms = ct(e.modules, "transformCode"), this.dataGenFns = ct(e.modules, "genData"), this.directives = h(h({}, $s), e.directives);
            var t = e.isReservedTag || zn;
            this.maybeComponent = function(e) {
                return !t(e.tag)
            }, this.onceId = 0, this.staticRenderFns = []
        };
    new RegExp("\\b" + "do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b") + "\\b"), new RegExp("\\b" + "delete,typeof,void".split(",").join("\\s*\\([^\\)]*\\)|\\b") + "\\s*\\([^\\)]*\\)");
    var Ss, _s, Ts = (Ss = function(e, t) {
            var n = an(e.trim(), t);
            !1 !== t.optimize && fn(n, t);
            var i = gn(n, t);
            return {
                ast: n,
                render: i.render,
                staticRenderFns: i.staticRenderFns
            }
        }, function(e) {
            function t(t, n) {
                var i = Object.create(e),
                    o = [],
                    r = [];
                if (i.warn = function(e, t) {
                        (t ? r : o).push(e)
                    }, n)
                    for (var s in n.modules && (i.modules = (e.modules || []).concat(n.modules)), n.directives && (i.directives = h(Object.create(e.directives || null), n.directives)), n) "modules" !== s && "directives" !== s && (i[s] = n[s]);
                var a = Ss(t, i);
                return a.errors = o, a.tips = r, a
            }
            return {
                compile: t,
                compileToFunctions: (n = t, i = Object.create(null), function(e, t, o) {
                    (t = h({}, t)).warn, delete t.warn;
                    var r = t.delimiters ? String(t.delimiters) + e : e;
                    if (i[r]) return i[r];
                    var s = n(e, t),
                        a = {},
                        l = [];
                    return a.render = Dn(s.render, l), a.staticRenderFns = s.staticRenderFns.map(function(e) {
                        return Dn(e, l)
                    }), i[r] = a
                })
            };
            var n, i
        })(vs).compileToFunctions,
        As = !!Gn && En(!1),
        Ds = !!Gn && En(!0),
        Es = p(function(e) {
            var t = Je(e);
            return t && t.innerHTML
        }),
        js = He.prototype.$mount;
    return He.prototype.$mount = function(e, t) {
        if ((e = e && Je(e)) === document.body || e === document.documentElement) return this;
        var n = this.$options;
        if (!n.render) {
            var i = n.template;
            if (i)
                if ("string" == typeof i) "#" === i.charAt(0) && (i = Es(i));
                else {
                    if (!i.nodeType) return this;
                    i = i.innerHTML
                } else e && (i = function(e) {
                if (e.outerHTML) return e.outerHTML;
                var t = document.createElement("div");
                return t.appendChild(e.cloneNode(!0)), t.innerHTML
            }(e));
            if (i) {
                var o = Ts(i, {
                        shouldDecodeNewlines: As,
                        shouldDecodeNewlinesForHref: Ds,
                        delimiters: n.delimiters,
                        comments: n.comments
                    }, this),
                    r = o.render,
                    s = o.staticRenderFns;
                n.render = r, n.staticRenderFns = s
            }
        }
        return js.call(this, e, t)
    }, He.compile = Ts, He
}),
function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
    "use strict";
    var t = window.Slick || {};
    (t = function() {
        var t = 0;
        return function(n, i) {
            var o, r = this;
            r.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: e(n),
                appendDots: e(n),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(t, n) {
                    return e('<button type="button" />').text(n + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                focusOnChange: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            }, r.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: !1,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                swiping: !1,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            }, e.extend(r, r.initials), r.activeBreakpoint = null, r.animType = null, r.animProp = null, r.breakpoints = [], r.breakpointSettings = [], r.cssTransitions = !1, r.focussed = !1, r.interrupted = !1, r.hidden = "hidden", r.paused = !0, r.positionProp = null, r.respondTo = null, r.rowCount = 1, r.shouldClick = !0, r.$slider = e(n), r.$slidesCache = null, r.transformType = null, r.transitionType = null, r.visibilityChange = "visibilitychange", r.windowWidth = 0, r.windowTimer = null, o = e(n).data("slick") || {}, r.options = e.extend({}, r.defaults, i, o), r.currentSlide = r.options.initialSlide, r.originalSettings = r.options, void 0 !== document.mozHidden ? (r.hidden = "mozHidden", r.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (r.hidden = "webkitHidden", r.visibilityChange = "webkitvisibilitychange"), r.autoPlay = e.proxy(r.autoPlay, r), r.autoPlayClear = e.proxy(r.autoPlayClear, r), r.autoPlayIterator = e.proxy(r.autoPlayIterator, r), r.changeSlide = e.proxy(r.changeSlide, r), r.clickHandler = e.proxy(r.clickHandler, r), r.selectHandler = e.proxy(r.selectHandler, r), r.setPosition = e.proxy(r.setPosition, r), r.swipeHandler = e.proxy(r.swipeHandler, r), r.dragHandler = e.proxy(r.dragHandler, r), r.keyHandler = e.proxy(r.keyHandler, r), r.instanceUid = t++, r.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, r.registerBreakpoints(), r.init(!0)
        }
    }()).prototype.activateADA = function() {
        this.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        })
    }, t.prototype.addSlide = t.prototype.slickAdd = function(t, n, i) {
        var o = this;
        if ("boolean" == typeof n) i = n, n = null;
        else if (n < 0 || n >= o.slideCount) return !1;
        o.unload(), "number" == typeof n ? 0 === n && 0 === o.$slides.length ? e(t).appendTo(o.$slideTrack) : i ? e(t).insertBefore(o.$slides.eq(n)) : e(t).insertAfter(o.$slides.eq(n)) : !0 === i ? e(t).prependTo(o.$slideTrack) : e(t).appendTo(o.$slideTrack), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slides.each(function(t, n) {
            e(n).attr("data-slick-index", t)
        }), o.$slidesCache = o.$slides, o.reinit()
    }, t.prototype.animateHeight = function() {
        var e = this;
        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
            var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
            e.$list.animate({
                height: t
            }, e.options.speed)
        }
    }, t.prototype.animateSlide = function(t, n) {
        var i = {},
            o = this;
        o.animateHeight(), !0 === o.options.rtl && !1 === o.options.vertical && (t = -t), !1 === o.transformsEnabled ? !1 === o.options.vertical ? o.$slideTrack.animate({
            left: t
        }, o.options.speed, o.options.easing, n) : o.$slideTrack.animate({
            top: t
        }, o.options.speed, o.options.easing, n) : !1 === o.cssTransitions ? (!0 === o.options.rtl && (o.currentLeft = -o.currentLeft), e({
            animStart: o.currentLeft
        }).animate({
            animStart: t
        }, {
            duration: o.options.speed,
            easing: o.options.easing,
            step: function(e) {
                e = Math.ceil(e), !1 === o.options.vertical ? (i[o.animType] = "translate(" + e + "px, 0px)", o.$slideTrack.css(i)) : (i[o.animType] = "translate(0px," + e + "px)", o.$slideTrack.css(i))
            },
            complete: function() {
                n && n.call()
            }
        })) : (o.applyTransition(), t = Math.ceil(t), !1 === o.options.vertical ? i[o.animType] = "translate3d(" + t + "px, 0px, 0px)" : i[o.animType] = "translate3d(0px," + t + "px, 0px)", o.$slideTrack.css(i), n && setTimeout(function() {
            o.disableTransition(), n.call()
        }, o.options.speed))
    }, t.prototype.getNavTarget = function() {
        var t = this,
            n = t.options.asNavFor;
        return n && null !== n && (n = e(n).not(t.$slider)), n
    }, t.prototype.asNavFor = function(t) {
        var n = this.getNavTarget();
        null !== n && "object" == typeof n && n.each(function() {
            var n = e(this).slick("getSlick");
            n.unslicked || n.slideHandler(t, !0)
        })
    }, t.prototype.applyTransition = function(e) {
        var t = this,
            n = {};
        !1 === t.options.fade ? n[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : n[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase, !1 === t.options.fade ? t.$slideTrack.css(n) : t.$slides.eq(e).css(n)
    }, t.prototype.autoPlay = function() {
        var e = this;
        e.autoPlayClear(), e.slideCount > e.options.slidesToShow && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
    }, t.prototype.autoPlayClear = function() {
        var e = this;
        e.autoPlayTimer && clearInterval(e.autoPlayTimer)
    }, t.prototype.autoPlayIterator = function() {
        var e = this,
            t = e.currentSlide + e.options.slidesToScroll;
        e.paused || e.interrupted || e.focussed || (!1 === e.options.infinite && (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : 0 === e.direction && (t = e.currentSlide - e.options.slidesToScroll, e.currentSlide - 1 == 0 && (e.direction = 1))), e.slideHandler(t))
    }, t.prototype.buildArrows = function() {
        var t = this;
        !0 === t.options.arrows && (t.$prevArrow = e(t.options.prevArrow).addClass("slick-arrow"), t.$nextArrow = e(t.options.nextArrow).addClass("slick-arrow"), t.slideCount > t.options.slidesToShow ? (t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.prependTo(t.options.appendArrows), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.appendTo(t.options.appendArrows), !0 !== t.options.infinite && t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }, t.prototype.buildDots = function() {
        var t, n, i = this;
        if (!0 === i.options.dots) {
            for (i.$slider.addClass("slick-dotted"), n = e("<ul />").addClass(i.options.dotsClass), t = 0; t <= i.getDotCount(); t += 1) n.append(e("<li />").append(i.options.customPaging.call(this, i, t)));
            i.$dots = n.appendTo(i.options.appendDots), i.$dots.find("li").first().addClass("slick-active")
        }
    }, t.prototype.buildOut = function() {
        var t = this;
        t.$slides = t.$slider.children(t.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), t.slideCount = t.$slides.length, t.$slides.each(function(t, n) {
            e(n).attr("data-slick-index", t).data("originalStyling", e(n).attr("style") || "")
        }), t.$slider.addClass("slick-slider"), t.$slideTrack = 0 === t.slideCount ? e('<div class="slick-track"/>').appendTo(t.$slider) : t.$slides.wrapAll('<div class="slick-track"/>').parent(), t.$list = t.$slideTrack.wrap('<div class="slick-list"/>').parent(), t.$slideTrack.css("opacity", 0), !0 !== t.options.centerMode && !0 !== t.options.swipeToSlide || (t.options.slidesToScroll = 1), e("img[data-lazy]", t.$slider).not("[src]").addClass("slick-loading"), t.setupInfinite(), t.buildArrows(), t.buildDots(), t.updateDots(), t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0), !0 === t.options.draggable && t.$list.addClass("draggable")
    }, t.prototype.buildRows = function() {
        var e, t, n, i, o, r, s, a = this;
        if (i = document.createDocumentFragment(), r = a.$slider.children(), a.options.rows > 1) {
            for (s = a.options.slidesPerRow * a.options.rows, o = Math.ceil(r.length / s), e = 0; e < o; e++) {
                var l = document.createElement("div");
                for (t = 0; t < a.options.rows; t++) {
                    var c = document.createElement("div");
                    for (n = 0; n < a.options.slidesPerRow; n++) {
                        var d = e * s + (t * a.options.slidesPerRow + n);
                        r.get(d) && c.appendChild(r.get(d))
                    }
                    l.appendChild(c)
                }
                i.appendChild(l)
            }
            a.$slider.empty().append(i), a.$slider.children().children().children().css({
                width: 100 / a.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }, t.prototype.checkResponsive = function(t, n) {
        var i, o, r, s = this,
            a = !1,
            l = s.$slider.width(),
            c = window.innerWidth || e(window).width();
        if ("window" === s.respondTo ? r = c : "slider" === s.respondTo ? r = l : "min" === s.respondTo && (r = Math.min(c, l)), s.options.responsive && s.options.responsive.length && null !== s.options.responsive) {
            o = null;
            for (i in s.breakpoints) s.breakpoints.hasOwnProperty(i) && (!1 === s.originalSettings.mobileFirst ? r < s.breakpoints[i] && (o = s.breakpoints[i]) : r > s.breakpoints[i] && (o = s.breakpoints[i]));
            null !== o ? null !== s.activeBreakpoint ? (o !== s.activeBreakpoint || n) && (s.activeBreakpoint = o, "unslick" === s.breakpointSettings[o] ? s.unslick(o) : (s.options = e.extend({}, s.originalSettings, s.breakpointSettings[o]), !0 === t && (s.currentSlide = s.options.initialSlide), s.refresh(t)), a = o) : (s.activeBreakpoint = o, "unslick" === s.breakpointSettings[o] ? s.unslick(o) : (s.options = e.extend({}, s.originalSettings, s.breakpointSettings[o]), !0 === t && (s.currentSlide = s.options.initialSlide), s.refresh(t)), a = o) : null !== s.activeBreakpoint && (s.activeBreakpoint = null, s.options = s.originalSettings, !0 === t && (s.currentSlide = s.options.initialSlide), s.refresh(t), a = o), t || !1 === a || s.$slider.trigger("breakpoint", [s, a])
        }
    }, t.prototype.changeSlide = function(t, n) {
        var i, o, r, s = this,
            a = e(t.currentTarget);
        switch (a.is("a") && t.preventDefault(), a.is("li") || (a = a.closest("li")), r = s.slideCount % s.options.slidesToScroll != 0, i = r ? 0 : (s.slideCount - s.currentSlide) % s.options.slidesToScroll, t.data.message) {
            case "previous":
                o = 0 === i ? s.options.slidesToScroll : s.options.slidesToShow - i, s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide - o, !1, n);
                break;
            case "next":
                o = 0 === i ? s.options.slidesToScroll : i, s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide + o, !1, n);
                break;
            case "index":
                var l = 0 === t.data.index ? 0 : t.data.index || a.index() * s.options.slidesToScroll;
                s.slideHandler(s.checkNavigable(l), !1, n), a.children().trigger("focus");
                break;
            default:
                return
        }
    }, t.prototype.checkNavigable = function(e) {
        var t, n;
        if (t = this.getNavigableIndexes(), n = 0, e > t[t.length - 1]) e = t[t.length - 1];
        else
            for (var i in t) {
                if (e < t[i]) {
                    e = n;
                    break
                }
                n = t[i]
            }
        return e
    }, t.prototype.cleanUpEvents = function() {
        var t = this;
        t.options.dots && null !== t.$dots && (e("li", t.$dots).off("click.slick", t.changeSlide).off("mouseenter.slick", e.proxy(t.interrupt, t, !0)).off("mouseleave.slick", e.proxy(t.interrupt, t, !1)), !0 === t.options.accessibility && t.$dots.off("keydown.slick", t.keyHandler)), t.$slider.off("focus.slick blur.slick"), !0 === t.options.arrows && t.slideCount > t.options.slidesToShow && (t.$prevArrow && t.$prevArrow.off("click.slick", t.changeSlide), t.$nextArrow && t.$nextArrow.off("click.slick", t.changeSlide), !0 === t.options.accessibility && (t.$prevArrow && t.$prevArrow.off("keydown.slick", t.keyHandler), t.$nextArrow && t.$nextArrow.off("keydown.slick", t.keyHandler))), t.$list.off("touchstart.slick mousedown.slick", t.swipeHandler), t.$list.off("touchmove.slick mousemove.slick", t.swipeHandler), t.$list.off("touchend.slick mouseup.slick", t.swipeHandler), t.$list.off("touchcancel.slick mouseleave.slick", t.swipeHandler), t.$list.off("click.slick", t.clickHandler), e(document).off(t.visibilityChange, t.visibility), t.cleanUpSlideEvents(), !0 === t.options.accessibility && t.$list.off("keydown.slick", t.keyHandler), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().off("click.slick", t.selectHandler), e(window).off("orientationchange.slick.slick-" + t.instanceUid, t.orientationChange), e(window).off("resize.slick.slick-" + t.instanceUid, t.resize), e("[draggable!=true]", t.$slideTrack).off("dragstart", t.preventDefault), e(window).off("load.slick.slick-" + t.instanceUid, t.setPosition)
    }, t.prototype.cleanUpSlideEvents = function() {
        var t = this;
        t.$list.off("mouseenter.slick", e.proxy(t.interrupt, t, !0)), t.$list.off("mouseleave.slick", e.proxy(t.interrupt, t, !1))
    }, t.prototype.cleanUpRows = function() {
        var e, t = this;
        t.options.rows > 1 && ((e = t.$slides.children().children()).removeAttr("style"), t.$slider.empty().append(e))
    }, t.prototype.clickHandler = function(e) {
        !1 === this.shouldClick && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault())
    }, t.prototype.destroy = function(t) {
        var n = this;
        n.autoPlayClear(), n.touchObject = {}, n.cleanUpEvents(), e(".slick-cloned", n.$slider).detach(), n.$dots && n.$dots.remove(), n.$prevArrow && n.$prevArrow.length && (n.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), n.htmlExpr.test(n.options.prevArrow) && n.$prevArrow.remove()), n.$nextArrow && n.$nextArrow.length && (n.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), n.htmlExpr.test(n.options.nextArrow) && n.$nextArrow.remove()), n.$slides && (n.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            e(this).attr("style", e(this).data("originalStyling"))
        }), n.$slideTrack.children(this.options.slide).detach(), n.$slideTrack.detach(), n.$list.detach(), n.$slider.append(n.$slides)), n.cleanUpRows(), n.$slider.removeClass("slick-slider"), n.$slider.removeClass("slick-initialized"), n.$slider.removeClass("slick-dotted"), n.unslicked = !0, t || n.$slider.trigger("destroy", [n])
    }, t.prototype.disableTransition = function(e) {
        var t = this,
            n = {};
        n[t.transitionType] = "", !1 === t.options.fade ? t.$slideTrack.css(n) : t.$slides.eq(e).css(n)
    }, t.prototype.fadeSlide = function(e, t) {
        var n = this;
        !1 === n.cssTransitions ? (n.$slides.eq(e).css({
            zIndex: n.options.zIndex
        }), n.$slides.eq(e).animate({
            opacity: 1
        }, n.options.speed, n.options.easing, t)) : (n.applyTransition(e), n.$slides.eq(e).css({
            opacity: 1,
            zIndex: n.options.zIndex
        }), t && setTimeout(function() {
            n.disableTransition(e), t.call()
        }, n.options.speed))
    }, t.prototype.fadeSlideOut = function(e) {
        var t = this;
        !1 === t.cssTransitions ? t.$slides.eq(e).animate({
            opacity: 0,
            zIndex: t.options.zIndex - 2
        }, t.options.speed, t.options.easing) : (t.applyTransition(e), t.$slides.eq(e).css({
            opacity: 0,
            zIndex: t.options.zIndex - 2
        }))
    }, t.prototype.filterSlides = t.prototype.slickFilter = function(e) {
        var t = this;
        null !== e && (t.$slidesCache = t.$slides, t.unload(), t.$slideTrack.children(this.options.slide).detach(), t.$slidesCache.filter(e).appendTo(t.$slideTrack), t.reinit())
    }, t.prototype.focusHandler = function() {
        var t = this;
        t.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function(n) {
            n.stopImmediatePropagation();
            var i = e(this);
            setTimeout(function() {
                t.options.pauseOnFocus && (t.focussed = i.is(":focus"), t.autoPlay())
            }, 0)
        })
    }, t.prototype.getCurrent = t.prototype.slickCurrentSlide = function() {
        return this.currentSlide
    }, t.prototype.getDotCount = function() {
        var e = this,
            t = 0,
            n = 0,
            i = 0;
        if (!0 === e.options.infinite)
            if (e.slideCount <= e.options.slidesToShow) ++i;
            else
                for (; t < e.slideCount;) ++i, t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        else if (!0 === e.options.centerMode) i = e.slideCount;
        else if (e.options.asNavFor)
            for (; t < e.slideCount;) ++i, t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        else i = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
        return i - 1
    }, t.prototype.getLeft = function(e) {
        var t, n, i, o, r = this,
            s = 0;
        return r.slideOffset = 0, n = r.$slides.first().outerHeight(!0), !0 === r.options.infinite ? (r.slideCount > r.options.slidesToShow && (r.slideOffset = r.slideWidth * r.options.slidesToShow * -1, o = -1, !0 === r.options.vertical && !0 === r.options.centerMode && (2 === r.options.slidesToShow ? o = -1.5 : 1 === r.options.slidesToShow && (o = -2)), s = n * r.options.slidesToShow * o), r.slideCount % r.options.slidesToScroll != 0 && e + r.options.slidesToScroll > r.slideCount && r.slideCount > r.options.slidesToShow && (e > r.slideCount ? (r.slideOffset = (r.options.slidesToShow - (e - r.slideCount)) * r.slideWidth * -1, s = (r.options.slidesToShow - (e - r.slideCount)) * n * -1) : (r.slideOffset = r.slideCount % r.options.slidesToScroll * r.slideWidth * -1, s = r.slideCount % r.options.slidesToScroll * n * -1))) : e + r.options.slidesToShow > r.slideCount && (r.slideOffset = (e + r.options.slidesToShow - r.slideCount) * r.slideWidth, s = (e + r.options.slidesToShow - r.slideCount) * n), r.slideCount <= r.options.slidesToShow && (r.slideOffset = 0, s = 0), !0 === r.options.centerMode && r.slideCount <= r.options.slidesToShow ? r.slideOffset = r.slideWidth * Math.floor(r.options.slidesToShow) / 2 - r.slideWidth * r.slideCount / 2 : !0 === r.options.centerMode && !0 === r.options.infinite ? r.slideOffset += r.slideWidth * Math.floor(r.options.slidesToShow / 2) - r.slideWidth : !0 === r.options.centerMode && (r.slideOffset = 0, r.slideOffset += r.slideWidth * Math.floor(r.options.slidesToShow / 2)), t = !1 === r.options.vertical ? e * r.slideWidth * -1 + r.slideOffset : e * n * -1 + s, !0 === r.options.variableWidth && (i = r.slideCount <= r.options.slidesToShow || !1 === r.options.infinite ? r.$slideTrack.children(".slick-slide").eq(e) : r.$slideTrack.children(".slick-slide").eq(e + r.options.slidesToShow), t = !0 === r.options.rtl ? i[0] ? -1 * (r.$slideTrack.width() - i[0].offsetLeft - i.width()) : 0 : i[0] ? -1 * i[0].offsetLeft : 0, !0 === r.options.centerMode && (i = r.slideCount <= r.options.slidesToShow || !1 === r.options.infinite ? r.$slideTrack.children(".slick-slide").eq(e) : r.$slideTrack.children(".slick-slide").eq(e + r.options.slidesToShow + 1), t = !0 === r.options.rtl ? i[0] ? -1 * (r.$slideTrack.width() - i[0].offsetLeft - i.width()) : 0 : i[0] ? -1 * i[0].offsetLeft : 0, t += (r.$list.width() - i.outerWidth()) / 2)), t
    }, t.prototype.getOption = t.prototype.slickGetOption = function(e) {
        return this.options[e]
    }, t.prototype.getNavigableIndexes = function() {
        var e, t = this,
            n = 0,
            i = 0,
            o = [];
        for (!1 === t.options.infinite ? e = t.slideCount : (n = -1 * t.options.slidesToScroll, i = -1 * t.options.slidesToScroll, e = 2 * t.slideCount); n < e;) o.push(n), n = i + t.options.slidesToScroll, i += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
        return o
    }, t.prototype.getSlick = function() {
        return this
    }, t.prototype.getSlideCount = function() {
        var t, n, i = this;
        return n = !0 === i.options.centerMode ? i.slideWidth * Math.floor(i.options.slidesToShow / 2) : 0, !0 === i.options.swipeToSlide ? (i.$slideTrack.find(".slick-slide").each(function(o, r) {
            if (r.offsetLeft - n + e(r).outerWidth() / 2 > -1 * i.swipeLeft) return t = r, !1
        }), Math.abs(e(t).attr("data-slick-index") - i.currentSlide) || 1) : i.options.slidesToScroll
    }, t.prototype.goTo = t.prototype.slickGoTo = function(e, t) {
        this.changeSlide({
            data: {
                message: "index",
                index: parseInt(e)
            }
        }, t)
    }, t.prototype.init = function(t) {
        var n = this;
        e(n.$slider).hasClass("slick-initialized") || (e(n.$slider).addClass("slick-initialized"), n.buildRows(), n.buildOut(), n.setProps(), n.startLoad(), n.loadSlider(), n.initializeEvents(), n.updateArrows(), n.updateDots(), n.checkResponsive(!0), n.focusHandler()), t && n.$slider.trigger("init", [n]), !0 === n.options.accessibility && n.initADA(), n.options.autoplay && (n.paused = !1, n.autoPlay())
    }, t.prototype.initADA = function() {
        var t = this,
            n = Math.ceil(t.slideCount / t.options.slidesToShow),
            i = t.getNavigableIndexes().filter(function(e) {
                return e >= 0 && e < t.slideCount
            });
        t.$slides.add(t.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }), null !== t.$dots && (t.$slides.not(t.$slideTrack.find(".slick-cloned")).each(function(n) {
            var o = i.indexOf(n);
            e(this).attr({
                role: "tabpanel",
                id: "slick-slide" + t.instanceUid + n,
                tabindex: -1
            }), -1 !== o && e(this).attr({
                "aria-describedby": "slick-slide-control" + t.instanceUid + o
            })
        }), t.$dots.attr("role", "tablist").find("li").each(function(o) {
            var r = i[o];
            e(this).attr({
                role: "presentation"
            }), e(this).find("button").first().attr({
                role: "tab",
                id: "slick-slide-control" + t.instanceUid + o,
                "aria-controls": "slick-slide" + t.instanceUid + r,
                "aria-label": o + 1 + " of " + n,
                "aria-selected": null,
                tabindex: "-1"
            })
        }).eq(t.currentSlide).find("button").attr({
            "aria-selected": "true",
            tabindex: "0"
        }).end());
        for (var o = t.currentSlide, r = o + t.options.slidesToShow; o < r; o++) t.$slides.eq(o).attr("tabindex", 0);
        t.activateADA()
    }, t.prototype.initArrowEvents = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, e.changeSlide), e.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow.on("keydown.slick", e.keyHandler), e.$nextArrow.on("keydown.slick", e.keyHandler)))
    }, t.prototype.initDotEvents = function() {
        var t = this;
        !0 === t.options.dots && (e("li", t.$dots).on("click.slick", {
            message: "index"
        }, t.changeSlide), !0 === t.options.accessibility && t.$dots.on("keydown.slick", t.keyHandler)), !0 === t.options.dots && !0 === t.options.pauseOnDotsHover && e("li", t.$dots).on("mouseenter.slick", e.proxy(t.interrupt, t, !0)).on("mouseleave.slick", e.proxy(t.interrupt, t, !1))
    }, t.prototype.initSlideEvents = function() {
        var t = this;
        t.options.pauseOnHover && (t.$list.on("mouseenter.slick", e.proxy(t.interrupt, t, !0)), t.$list.on("mouseleave.slick", e.proxy(t.interrupt, t, !1)))
    }, t.prototype.initializeEvents = function() {
        var t = this;
        t.initArrowEvents(), t.initDotEvents(), t.initSlideEvents(), t.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, t.swipeHandler), t.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, t.swipeHandler), t.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, t.swipeHandler), t.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, t.swipeHandler), t.$list.on("click.slick", t.clickHandler), e(document).on(t.visibilityChange, e.proxy(t.visibility, t)), !0 === t.options.accessibility && t.$list.on("keydown.slick", t.keyHandler), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler), e(window).on("orientationchange.slick.slick-" + t.instanceUid, e.proxy(t.orientationChange, t)), e(window).on("resize.slick.slick-" + t.instanceUid, e.proxy(t.resize, t)), e("[draggable!=true]", t.$slideTrack).on("dragstart", t.preventDefault), e(window).on("load.slick.slick-" + t.instanceUid, t.setPosition), e(t.setPosition)
    }, t.prototype.initUI = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(), e.$nextArrow.show()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.show()
    }, t.prototype.keyHandler = function(e) {
        var t = this;
        e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && !0 === t.options.accessibility ? t.changeSlide({
            data: {
                message: !0 === t.options.rtl ? "next" : "previous"
            }
        }) : 39 === e.keyCode && !0 === t.options.accessibility && t.changeSlide({
            data: {
                message: !0 === t.options.rtl ? "previous" : "next"
            }
        }))
    }, t.prototype.lazyLoad = function() {
        function t(t) {
            e("img[data-lazy]", t).each(function() {
                var t = e(this),
                    n = e(this).attr("data-lazy"),
                    i = e(this).attr("data-srcset"),
                    o = e(this).attr("data-sizes") || r.$slider.attr("data-sizes"),
                    s = document.createElement("img");
                s.onload = function() {
                    t.animate({
                        opacity: 0
                    }, 100, function() {
                        i && (t.attr("srcset", i), o && t.attr("sizes", o)), t.attr("src", n).animate({
                            opacity: 1
                        }, 200, function() {
                            t.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        }), r.$slider.trigger("lazyLoaded", [r, t, n])
                    })
                }, s.onerror = function() {
                    t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), r.$slider.trigger("lazyLoadError", [r, t, n])
                }, s.src = n
            })
        }
        var n, i, o, r = this;
        if (!0 === r.options.centerMode ? !0 === r.options.infinite ? o = (i = r.currentSlide + (r.options.slidesToShow / 2 + 1)) + r.options.slidesToShow + 2 : (i = Math.max(0, r.currentSlide - (r.options.slidesToShow / 2 + 1)), o = r.options.slidesToShow / 2 + 1 + 2 + r.currentSlide) : (i = r.options.infinite ? r.options.slidesToShow + r.currentSlide : r.currentSlide, o = Math.ceil(i + r.options.slidesToShow), !0 === r.options.fade && (i > 0 && i--, o <= r.slideCount && o++)), n = r.$slider.find(".slick-slide").slice(i, o), "anticipated" === r.options.lazyLoad)
            for (var s = i - 1, a = o, l = r.$slider.find(".slick-slide"), c = 0; c < r.options.slidesToScroll; c++) s < 0 && (s = r.slideCount - 1), n = (n = n.add(l.eq(s))).add(l.eq(a)), s--, a++;
        t(n), r.slideCount <= r.options.slidesToShow ? t(r.$slider.find(".slick-slide")) : r.currentSlide >= r.slideCount - r.options.slidesToShow ? t(r.$slider.find(".slick-cloned").slice(0, r.options.slidesToShow)) : 0 === r.currentSlide && t(r.$slider.find(".slick-cloned").slice(-1 * r.options.slidesToShow))
    }, t.prototype.loadSlider = function() {
        var e = this;
        e.setPosition(), e.$slideTrack.css({
            opacity: 1
        }), e.$slider.removeClass("slick-loading"), e.initUI(), "progressive" === e.options.lazyLoad && e.progressiveLazyLoad()
    }, t.prototype.next = t.prototype.slickNext = function() {
        this.changeSlide({
            data: {
                message: "next"
            }
        })
    }, t.prototype.orientationChange = function() {
        var e = this;
        e.checkResponsive(), e.setPosition()
    }, t.prototype.pause = t.prototype.slickPause = function() {
        var e = this;
        e.autoPlayClear(), e.paused = !0
    }, t.prototype.play = t.prototype.slickPlay = function() {
        var e = this;
        e.autoPlay(), e.options.autoplay = !0, e.paused = !1, e.focussed = !1, e.interrupted = !1
    }, t.prototype.postSlide = function(t) {
        var n = this;
        n.unslicked || (n.$slider.trigger("afterChange", [n, t]), n.animating = !1, n.slideCount > n.options.slidesToShow && n.setPosition(), n.swipeLeft = null, n.options.autoplay && n.autoPlay(), !0 === n.options.accessibility && (n.initADA(), n.options.focusOnChange && e(n.$slides.get(n.currentSlide)).attr("tabindex", 0).focus()))
    }, t.prototype.prev = t.prototype.slickPrev = function() {
        this.changeSlide({
            data: {
                message: "previous"
            }
        })
    }, t.prototype.preventDefault = function(e) {
        e.preventDefault()
    }, t.prototype.progressiveLazyLoad = function(t) {
        t = t || 1;
        var n, i, o, r, s, a = this,
            l = e("img[data-lazy]", a.$slider);
        l.length ? (n = l.first(), i = n.attr("data-lazy"), o = n.attr("data-srcset"), r = n.attr("data-sizes") || a.$slider.attr("data-sizes"), (s = document.createElement("img")).onload = function() {
            o && (n.attr("srcset", o), r && n.attr("sizes", r)), n.attr("src", i).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === a.options.adaptiveHeight && a.setPosition(), a.$slider.trigger("lazyLoaded", [a, n, i]), a.progressiveLazyLoad()
        }, s.onerror = function() {
            t < 3 ? setTimeout(function() {
                a.progressiveLazyLoad(t + 1)
            }, 500) : (n.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), a.$slider.trigger("lazyLoadError", [a, n, i]), a.progressiveLazyLoad())
        }, s.src = i) : a.$slider.trigger("allImagesLoaded", [a])
    }, t.prototype.refresh = function(t) {
        var n, i, o = this;
        i = o.slideCount - o.options.slidesToShow, !o.options.infinite && o.currentSlide > i && (o.currentSlide = i), o.slideCount <= o.options.slidesToShow && (o.currentSlide = 0), n = o.currentSlide, o.destroy(!0), e.extend(o, o.initials, {
            currentSlide: n
        }), o.init(), t || o.changeSlide({
            data: {
                message: "index",
                index: n
            }
        }, !1)
    }, t.prototype.registerBreakpoints = function() {
        var t, n, i, o = this,
            r = o.options.responsive || null;
        if ("array" === e.type(r) && r.length) {
            o.respondTo = o.options.respondTo || "window";
            for (t in r)
                if (i = o.breakpoints.length - 1, r.hasOwnProperty(t)) {
                    for (n = r[t].breakpoint; i >= 0;) o.breakpoints[i] && o.breakpoints[i] === n && o.breakpoints.splice(i, 1), i--;
                    o.breakpoints.push(n), o.breakpointSettings[n] = r[t].settings
                }
            o.breakpoints.sort(function(e, t) {
                return o.options.mobileFirst ? e - t : t - e
            })
        }
    }, t.prototype.reinit = function() {
        var t = this;
        t.$slides = t.$slideTrack.children(t.options.slide).addClass("slick-slide"), t.slideCount = t.$slides.length, t.currentSlide >= t.slideCount && 0 !== t.currentSlide && (t.currentSlide = t.currentSlide - t.options.slidesToScroll), t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0), t.registerBreakpoints(), t.setProps(), t.setupInfinite(), t.buildArrows(), t.updateArrows(), t.initArrowEvents(), t.buildDots(), t.updateDots(), t.initDotEvents(), t.cleanUpSlideEvents(), t.initSlideEvents(), t.checkResponsive(!1, !0), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler), t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0), t.setPosition(), t.focusHandler(), t.paused = !t.options.autoplay, t.autoPlay(), t.$slider.trigger("reInit", [t])
    }, t.prototype.resize = function() {
        var t = this;
        e(window).width() !== t.windowWidth && (clearTimeout(t.windowDelay), t.windowDelay = window.setTimeout(function() {
            t.windowWidth = e(window).width(), t.checkResponsive(), t.unslicked || t.setPosition()
        }, 50))
    }, t.prototype.removeSlide = t.prototype.slickRemove = function(e, t, n) {
        var i = this;
        if (e = "boolean" == typeof e ? !0 === (t = e) ? 0 : i.slideCount - 1 : !0 === t ? --e : e, i.slideCount < 1 || e < 0 || e > i.slideCount - 1) return !1;
        i.unload(), !0 === n ? i.$slideTrack.children().remove() : i.$slideTrack.children(this.options.slide).eq(e).remove(), i.$slides = i.$slideTrack.children(this.options.slide), i.$slideTrack.children(this.options.slide).detach(), i.$slideTrack.append(i.$slides), i.$slidesCache = i.$slides, i.reinit()
    }, t.prototype.setCSS = function(e) {
        var t, n, i = this,
            o = {};
        !0 === i.options.rtl && (e = -e), t = "left" == i.positionProp ? Math.ceil(e) + "px" : "0px", n = "top" == i.positionProp ? Math.ceil(e) + "px" : "0px", o[i.positionProp] = e, !1 === i.transformsEnabled ? i.$slideTrack.css(o) : (o = {}, !1 === i.cssTransitions ? (o[i.animType] = "translate(" + t + ", " + n + ")", i.$slideTrack.css(o)) : (o[i.animType] = "translate3d(" + t + ", " + n + ", 0px)", i.$slideTrack.css(o)))
    }, t.prototype.setDimensions = function() {
        var e = this;
        !1 === e.options.vertical ? !0 === e.options.centerMode && e.$list.css({
            padding: "0px " + e.options.centerPadding
        }) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow), !0 === e.options.centerMode && e.$list.css({
            padding: e.options.centerPadding + " 0px"
        })), e.listWidth = e.$list.width(), e.listHeight = e.$list.height(), !1 === e.options.vertical && !1 === e.options.variableWidth ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow), e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : !0 === e.options.variableWidth ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth), e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
        var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
        !1 === e.options.variableWidth && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
    }, t.prototype.setFade = function() {
        var t, n = this;
        n.$slides.each(function(i, o) {
            t = n.slideWidth * i * -1, !0 === n.options.rtl ? e(o).css({
                position: "relative",
                right: t,
                top: 0,
                zIndex: n.options.zIndex - 2,
                opacity: 0
            }) : e(o).css({
                position: "relative",
                left: t,
                top: 0,
                zIndex: n.options.zIndex - 2,
                opacity: 0
            })
        }), n.$slides.eq(n.currentSlide).css({
            zIndex: n.options.zIndex - 1,
            opacity: 1
        })
    }, t.prototype.setHeight = function() {
        var e = this;
        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
            var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
            e.$list.css("height", t)
        }
    }, t.prototype.setOption = t.prototype.slickSetOption = function() {
        var t, n, i, o, r, s = this,
            a = !1;
        if ("object" === e.type(arguments[0]) ? (i = arguments[0], a = arguments[1], r = "multiple") : "string" === e.type(arguments[0]) && (i = arguments[0], o = arguments[1], a = arguments[2], "responsive" === arguments[0] && "array" === e.type(arguments[1]) ? r = "responsive" : void 0 !== arguments[1] && (r = "single")), "single" === r) s.options[i] = o;
        else if ("multiple" === r) e.each(i, function(e, t) {
            s.options[e] = t
        });
        else if ("responsive" === r)
            for (n in o)
                if ("array" !== e.type(s.options.responsive)) s.options.responsive = [o[n]];
                else {
                    for (t = s.options.responsive.length - 1; t >= 0;) s.options.responsive[t].breakpoint === o[n].breakpoint && s.options.responsive.splice(t, 1), t--;
                    s.options.responsive.push(o[n])
                }
        a && (s.unload(), s.reinit())
    }, t.prototype.setPosition = function() {
        var e = this;
        e.setDimensions(), e.setHeight(), !1 === e.options.fade ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(), e.$slider.trigger("setPosition", [e])
    }, t.prototype.setProps = function() {
        var e = this,
            t = document.body.style;
        e.positionProp = !0 === e.options.vertical ? "top" : "left", "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"), void 0 === t.WebkitTransition && void 0 === t.MozTransition && void 0 === t.msTransition || !0 === e.options.useCSS && (e.cssTransitions = !0), e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex), void 0 !== t.OTransform && (e.animType = "OTransform", e.transformType = "-o-transform", e.transitionType = "OTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.MozTransform && (e.animType = "MozTransform", e.transformType = "-moz-transform", e.transitionType = "MozTransition", void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)), void 0 !== t.webkitTransform && (e.animType = "webkitTransform", e.transformType = "-webkit-transform", e.transitionType = "webkitTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.msTransform && (e.animType = "msTransform", e.transformType = "-ms-transform", e.transitionType = "msTransition", void 0 === t.msTransform && (e.animType = !1)), void 0 !== t.transform && !1 !== e.animType && (e.animType = "transform", e.transformType = "transform", e.transitionType = "transition"), e.transformsEnabled = e.options.useTransform && null !== e.animType && !1 !== e.animType
    }, t.prototype.setSlideClasses = function(e) {
        var t, n, i, o, r = this;
        if (n = r.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), r.$slides.eq(e).addClass("slick-current"), !0 === r.options.centerMode) {
            var s = r.options.slidesToShow % 2 == 0 ? 1 : 0;
            t = Math.floor(r.options.slidesToShow / 2), !0 === r.options.infinite && (e >= t && e <= r.slideCount - 1 - t ? r.$slides.slice(e - t + s, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (i = r.options.slidesToShow + e, n.slice(i - t + 1 + s, i + t + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === e ? n.eq(n.length - 1 - r.options.slidesToShow).addClass("slick-center") : e === r.slideCount - 1 && n.eq(r.options.slidesToShow).addClass("slick-center")), r.$slides.eq(e).addClass("slick-center")
        } else e >= 0 && e <= r.slideCount - r.options.slidesToShow ? r.$slides.slice(e, e + r.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : n.length <= r.options.slidesToShow ? n.addClass("slick-active").attr("aria-hidden", "false") : (o = r.slideCount % r.options.slidesToShow, i = !0 === r.options.infinite ? r.options.slidesToShow + e : e, r.options.slidesToShow == r.options.slidesToScroll && r.slideCount - e < r.options.slidesToShow ? n.slice(i - (r.options.slidesToShow - o), i + o).addClass("slick-active").attr("aria-hidden", "false") : n.slice(i, i + r.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
        "ondemand" !== r.options.lazyLoad && "anticipated" !== r.options.lazyLoad || r.lazyLoad()
    }, t.prototype.setupInfinite = function() {
        var t, n, i, o = this;
        if (!0 === o.options.fade && (o.options.centerMode = !1), !0 === o.options.infinite && !1 === o.options.fade && (n = null, o.slideCount > o.options.slidesToShow)) {
            for (i = !0 === o.options.centerMode ? o.options.slidesToShow + 1 : o.options.slidesToShow, t = o.slideCount; t > o.slideCount - i; t -= 1) n = t - 1, e(o.$slides[n]).clone(!0).attr("id", "").attr("data-slick-index", n - o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");
            for (t = 0; t < i + o.slideCount; t += 1) n = t, e(o.$slides[n]).clone(!0).attr("id", "").attr("data-slick-index", n + o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");
            o.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                e(this).attr("id", "")
            })
        }
    }, t.prototype.interrupt = function(e) {
        var t = this;
        e || t.autoPlay(), t.interrupted = e
    }, t.prototype.selectHandler = function(t) {
        var n = this,
            i = e(t.target).is(".slick-slide") ? e(t.target) : e(t.target).parents(".slick-slide"),
            o = parseInt(i.attr("data-slick-index"));
        o || (o = 0), n.slideCount <= n.options.slidesToShow ? n.slideHandler(o, !1, !0) : n.slideHandler(o)
    }, t.prototype.slideHandler = function(e, t, n) {
        var i, o, r, s, a, l = null,
            c = this;
        if (t = t || !1, !(!0 === c.animating && !0 === c.options.waitForAnimate || !0 === c.options.fade && c.currentSlide === e))
            if (!1 === t && c.asNavFor(e), i = e, l = c.getLeft(i), s = c.getLeft(c.currentSlide), c.currentLeft = null === c.swipeLeft ? s : c.swipeLeft, !1 === c.options.infinite && !1 === c.options.centerMode && (e < 0 || e > c.getDotCount() * c.options.slidesToScroll)) !1 === c.options.fade && (i = c.currentSlide, !0 !== n ? c.animateSlide(s, function() {
                c.postSlide(i)
            }) : c.postSlide(i));
            else if (!1 === c.options.infinite && !0 === c.options.centerMode && (e < 0 || e > c.slideCount - c.options.slidesToScroll)) !1 === c.options.fade && (i = c.currentSlide, !0 !== n ? c.animateSlide(s, function() {
            c.postSlide(i)
        }) : c.postSlide(i));
        else {
            if (c.options.autoplay && clearInterval(c.autoPlayTimer), o = i < 0 ? c.slideCount % c.options.slidesToScroll != 0 ? c.slideCount - c.slideCount % c.options.slidesToScroll : c.slideCount + i : i >= c.slideCount ? c.slideCount % c.options.slidesToScroll != 0 ? 0 : i - c.slideCount : i, c.animating = !0, c.$slider.trigger("beforeChange", [c, c.currentSlide, o]), r = c.currentSlide, c.currentSlide = o, c.setSlideClasses(c.currentSlide), c.options.asNavFor && (a = (a = c.getNavTarget()).slick("getSlick")).slideCount <= a.options.slidesToShow && a.setSlideClasses(c.currentSlide), c.updateDots(), c.updateArrows(), !0 === c.options.fade) return !0 !== n ? (c.fadeSlideOut(r), c.fadeSlide(o, function() {
                c.postSlide(o)
            })) : c.postSlide(o), void c.animateHeight();
            !0 !== n ? c.animateSlide(l, function() {
                c.postSlide(o)
            }) : c.postSlide(o)
        }
    }, t.prototype.startLoad = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(), e.$slider.addClass("slick-loading")
    }, t.prototype.swipeDirection = function() {
        var e, t, n, i, o = this;
        return e = o.touchObject.startX - o.touchObject.curX, t = o.touchObject.startY - o.touchObject.curY, n = Math.atan2(t, e), (i = Math.round(180 * n / Math.PI)) < 0 && (i = 360 - Math.abs(i)), i <= 45 && i >= 0 ? !1 === o.options.rtl ? "left" : "right" : i <= 360 && i >= 315 ? !1 === o.options.rtl ? "left" : "right" : i >= 135 && i <= 225 ? !1 === o.options.rtl ? "right" : "left" : !0 === o.options.verticalSwiping ? i >= 35 && i <= 135 ? "down" : "up" : "vertical"
    }, t.prototype.swipeEnd = function(e) {
        var t, n, i = this;
        if (i.dragging = !1, i.swiping = !1, i.scrolling) return i.scrolling = !1, !1;
        if (i.interrupted = !1, i.shouldClick = !(i.touchObject.swipeLength > 10), void 0 === i.touchObject.curX) return !1;
        if (!0 === i.touchObject.edgeHit && i.$slider.trigger("edge", [i, i.swipeDirection()]), i.touchObject.swipeLength >= i.touchObject.minSwipe) {
            switch (n = i.swipeDirection()) {
                case "left":
                case "down":
                    t = i.options.swipeToSlide ? i.checkNavigable(i.currentSlide + i.getSlideCount()) : i.currentSlide + i.getSlideCount(), i.currentDirection = 0;
                    break;
                case "right":
                case "up":
                    t = i.options.swipeToSlide ? i.checkNavigable(i.currentSlide - i.getSlideCount()) : i.currentSlide - i.getSlideCount(), i.currentDirection = 1
            }
            "vertical" != n && (i.slideHandler(t), i.touchObject = {}, i.$slider.trigger("swipe", [i, n]))
        } else i.touchObject.startX !== i.touchObject.curX && (i.slideHandler(i.currentSlide), i.touchObject = {})
    }, t.prototype.swipeHandler = function(e) {
        var t = this;
        if (!(!1 === t.options.swipe || "ontouchend" in document && !1 === t.options.swipe || !1 === t.options.draggable && -1 !== e.type.indexOf("mouse"))) switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1, t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold, !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold), e.data.action) {
            case "start":
                t.swipeStart(e);
                break;
            case "move":
                t.swipeMove(e);
                break;
            case "end":
                t.swipeEnd(e)
        }
    }, t.prototype.swipeMove = function(e) {
        var t, n, i, o, r, s, a = this;
        return r = void 0 !== e.originalEvent ? e.originalEvent.touches : null, !(!a.dragging || a.scrolling || r && 1 !== r.length) && (t = a.getLeft(a.currentSlide), a.touchObject.curX = void 0 !== r ? r[0].pageX : e.clientX, a.touchObject.curY = void 0 !== r ? r[0].pageY : e.clientY, a.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(a.touchObject.curX - a.touchObject.startX, 2))), s = Math.round(Math.sqrt(Math.pow(a.touchObject.curY - a.touchObject.startY, 2))), !a.options.verticalSwiping && !a.swiping && s > 4 ? (a.scrolling = !0, !1) : (!0 === a.options.verticalSwiping && (a.touchObject.swipeLength = s), n = a.swipeDirection(), void 0 !== e.originalEvent && a.touchObject.swipeLength > 4 && (a.swiping = !0, e.preventDefault()), o = (!1 === a.options.rtl ? 1 : -1) * (a.touchObject.curX > a.touchObject.startX ? 1 : -1), !0 === a.options.verticalSwiping && (o = a.touchObject.curY > a.touchObject.startY ? 1 : -1), i = a.touchObject.swipeLength, a.touchObject.edgeHit = !1, !1 === a.options.infinite && (0 === a.currentSlide && "right" === n || a.currentSlide >= a.getDotCount() && "left" === n) && (i = a.touchObject.swipeLength * a.options.edgeFriction, a.touchObject.edgeHit = !0), !1 === a.options.vertical ? a.swipeLeft = t + i * o : a.swipeLeft = t + i * (a.$list.height() / a.listWidth) * o, !0 === a.options.verticalSwiping && (a.swipeLeft = t + i * o), !0 !== a.options.fade && !1 !== a.options.touchMove && (!0 === a.animating ? (a.swipeLeft = null, !1) : void a.setCSS(a.swipeLeft))))
    }, t.prototype.swipeStart = function(e) {
        var t, n = this;
        if (n.interrupted = !0, 1 !== n.touchObject.fingerCount || n.slideCount <= n.options.slidesToShow) return n.touchObject = {}, !1;
        void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]), n.touchObject.startX = n.touchObject.curX = void 0 !== t ? t.pageX : e.clientX, n.touchObject.startY = n.touchObject.curY = void 0 !== t ? t.pageY : e.clientY, n.dragging = !0
    }, t.prototype.unfilterSlides = t.prototype.slickUnfilter = function() {
        var e = this;
        null !== e.$slidesCache && (e.unload(), e.$slideTrack.children(this.options.slide).detach(),
            e.$slidesCache.appendTo(e.$slideTrack), e.reinit())
    }, t.prototype.unload = function() {
        var t = this;
        e(".slick-cloned", t.$slider).remove(), t.$dots && t.$dots.remove(), t.$prevArrow && t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove(), t.$nextArrow && t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove(), t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }, t.prototype.unslick = function(e) {
        var t = this;
        t.$slider.trigger("unslick", [t, e]), t.destroy()
    }, t.prototype.updateArrows = function() {
        var e = this;
        Math.floor(e.options.slidesToShow / 2), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode ? (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - 1 && !0 === e.options.centerMode && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }, t.prototype.updateDots = function() {
        var e = this;
        null !== e.$dots && (e.$dots.find("li").removeClass("slick-active").end(), e.$dots.find("li").eq(Math.floor(e.currentSlide / e.options.slidesToScroll)).addClass("slick-active"))
    }, t.prototype.visibility = function() {
        var e = this;
        e.options.autoplay && (document[e.hidden] ? e.interrupted = !0 : e.interrupted = !1)
    }, e.fn.slick = function() {
        var e, n, i = this,
            o = arguments[0],
            r = Array.prototype.slice.call(arguments, 1),
            s = i.length;
        for (e = 0; e < s; e++)
            if ("object" == typeof o || void 0 === o ? i[e].slick = new t(i[e], o) : n = i[e].slick[o].apply(i[e].slick, r), void 0 !== n) return n;
        return i
    }
}),
function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e : e(jQuery)
}(function(e) {
    function t(t) {
        var s = t || window.event,
            a = l.call(arguments, 1),
            c = 0,
            u = 0,
            p = 0,
            f = 0,
            h = 0,
            v = 0;
        if (t = e.event.fix(s), t.type = "mousewheel", "detail" in s && (p = -1 * s.detail), "wheelDelta" in s && (p = s.wheelDelta), "wheelDeltaY" in s && (p = s.wheelDeltaY), "wheelDeltaX" in s && (u = -1 * s.wheelDeltaX), "axis" in s && s.axis === s.HORIZONTAL_AXIS && (u = -1 * p, p = 0), c = 0 === p ? u : p, "deltaY" in s && (p = -1 * s.deltaY, c = p), "deltaX" in s && (u = s.deltaX, 0 === p && (c = -1 * u)), 0 !== p || 0 !== u) {
            if (1 === s.deltaMode) {
                var m = e.data(this, "mousewheel-line-height");
                c *= m, p *= m, u *= m
            } else if (2 === s.deltaMode) {
                var g = e.data(this, "mousewheel-page-height");
                c *= g, p *= g, u *= g
            }
            if (f = Math.max(Math.abs(p), Math.abs(u)), (!r || r > f) && (r = f, i(s, f) && (r /= 40)), i(s, f) && (c /= 40, u /= 40, p /= 40), c = Math[c >= 1 ? "floor" : "ceil"](c / r), u = Math[u >= 1 ? "floor" : "ceil"](u / r), p = Math[p >= 1 ? "floor" : "ceil"](p / r), d.settings.normalizeOffset && this.getBoundingClientRect) {
                var y = this.getBoundingClientRect();
                h = t.clientX - y.left, v = t.clientY - y.top
            }
            return t.deltaX = u, t.deltaY = p, t.deltaFactor = r, t.offsetX = h, t.offsetY = v, t.deltaMode = 0, a.unshift(t, c, u, p), o && clearTimeout(o), o = setTimeout(n, 200), (e.event.dispatch || e.event.handle).apply(this, a)
        }
    }

    function n() {
        r = null
    }

    function i(e, t) {
        return d.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 == 0
    }
    var o, r, s = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
        a = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
        l = Array.prototype.slice;
    if (e.event.fixHooks)
        for (var c = s.length; c;) e.event.fixHooks[s[--c]] = e.event.mouseHooks;
    var d = e.event.special.mousewheel = {
        version: "3.1.12",
        setup: function() {
            if (this.addEventListener)
                for (var n = a.length; n;) this.addEventListener(a[--n], t, !1);
            else this.onmousewheel = t;
            e.data(this, "mousewheel-line-height", d.getLineHeight(this)), e.data(this, "mousewheel-page-height", d.getPageHeight(this))
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var n = a.length; n;) this.removeEventListener(a[--n], t, !1);
            else this.onmousewheel = null;
            e.removeData(this, "mousewheel-line-height"), e.removeData(this, "mousewheel-page-height")
        },
        getLineHeight: function(t) {
            var n = e(t),
                i = n["offsetParent" in e.fn ? "offsetParent" : "parent"]();
            return i.length || (i = e("body")), parseInt(i.css("fontSize"), 10) || parseInt(n.css("fontSize"), 10) || 16
        },
        getPageHeight: function(t) {
            return e(t).height()
        },
        settings: {
            adjustOldDeltas: !0,
            normalizeOffset: !0
        }
    };
    e.fn.extend({
        mousewheel: function(e) {
            return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
        },
        unmousewheel: function(e) {
            return this.unbind("mousewheel", e)
        }
    })
}),
function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? module.exports = e : e(jQuery)
}(function(e) {
    function t(t) {
        var s = t || window.event,
            a = l.call(arguments, 1),
            c = 0,
            u = 0,
            p = 0,
            f = 0,
            h = 0,
            v = 0;
        if (t = e.event.fix(s), t.type = "mousewheel", "detail" in s && (p = -1 * s.detail), "wheelDelta" in s && (p = s.wheelDelta), "wheelDeltaY" in s && (p = s.wheelDeltaY), "wheelDeltaX" in s && (u = -1 * s.wheelDeltaX), "axis" in s && s.axis === s.HORIZONTAL_AXIS && (u = -1 * p, p = 0), c = 0 === p ? u : p, "deltaY" in s && (p = -1 * s.deltaY, c = p), "deltaX" in s && (u = s.deltaX, 0 === p && (c = -1 * u)), 0 !== p || 0 !== u) {
            if (1 === s.deltaMode) {
                var m = e.data(this, "mousewheel-line-height");
                c *= m, p *= m, u *= m
            } else if (2 === s.deltaMode) {
                var g = e.data(this, "mousewheel-page-height");
                c *= g, p *= g, u *= g
            }
            if (f = Math.max(Math.abs(p), Math.abs(u)), (!r || r > f) && (r = f, i(s, f) && (r /= 40)), i(s, f) && (c /= 40, u /= 40, p /= 40), c = Math[c >= 1 ? "floor" : "ceil"](c / r), u = Math[u >= 1 ? "floor" : "ceil"](u / r), p = Math[p >= 1 ? "floor" : "ceil"](p / r), d.settings.normalizeOffset && this.getBoundingClientRect) {
                var y = this.getBoundingClientRect();
                h = t.clientX - y.left, v = t.clientY - y.top
            }
            return t.deltaX = u, t.deltaY = p, t.deltaFactor = r, t.offsetX = h, t.offsetY = v, t.deltaMode = 0, a.unshift(t, c, u, p), o && clearTimeout(o), o = setTimeout(n, 200), (e.event.dispatch || e.event.handle).apply(this, a)
        }
    }

    function n() {
        r = null
    }

    function i(e, t) {
        return d.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 == 0
    }
    var o, r, s = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
        a = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
        l = Array.prototype.slice;
    if (e.event.fixHooks)
        for (var c = s.length; c;) e.event.fixHooks[s[--c]] = e.event.mouseHooks;
    var d = e.event.special.mousewheel = {
        version: "3.1.12",
        setup: function() {
            if (this.addEventListener)
                for (var n = a.length; n;) this.addEventListener(a[--n], t, !1);
            else this.onmousewheel = t;
            e.data(this, "mousewheel-line-height", d.getLineHeight(this)), e.data(this, "mousewheel-page-height", d.getPageHeight(this))
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var n = a.length; n;) this.removeEventListener(a[--n], t, !1);
            else this.onmousewheel = null;
            e.removeData(this, "mousewheel-line-height"), e.removeData(this, "mousewheel-page-height")
        },
        getLineHeight: function(t) {
            var n = e(t),
                i = n["offsetParent" in e.fn ? "offsetParent" : "parent"]();
            return i.length || (i = e("body")), parseInt(i.css("fontSize"), 10) || parseInt(n.css("fontSize"), 10) || 16
        },
        getPageHeight: function(t) {
            return e(t).height()
        },
        settings: {
            adjustOldDeltas: !0,
            normalizeOffset: !0
        }
    };
    e.fn.extend({
        mousewheel: function(e) {
            return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
        },
        unmousewheel: function(e) {
            return this.unbind("mousewheel", e)
        }
    })
}),
function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof module && module.exports ? module.exports = e : e(jQuery, window, document)
}(function(e) {
    ! function(t) {
        var n = "function" == typeof define && define.amd,
            i = "undefined" != typeof module && module.exports,
            o = "https:" == document.location.protocol ? "https:" : "http:";
        n || (i ? require("jquery-mousewheel")(e) : e.event.special.mousewheel || e("head").append(decodeURI("%3Cscript src=" + o + "//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js%3E%3C/script%3E"))),
            function() {
                var t, n = "mCustomScrollbar",
                    i = "mCS",
                    o = ".mCustomScrollbar",
                    r = {
                        setTop: 0,
                        setLeft: 0,
                        axis: "y",
                        scrollbarPosition: "inside",
                        scrollInertia: 950,
                        autoDraggerLength: !0,
                        alwaysShowScrollbar: 0,
                        snapOffset: 0,
                        mouseWheel: {
                            enable: !0,
                            scrollAmount: "auto",
                            axis: "y",
                            deltaFactor: "auto",
                            disableOver: ["select", "option", "keygen", "datalist", "textarea"]
                        },
                        scrollButtons: {
                            scrollType: "stepless",
                            scrollAmount: "auto"
                        },
                        keyboard: {
                            enable: !0,
                            scrollType: "stepless",
                            scrollAmount: "auto"
                        },
                        contentTouchScroll: 25,
                        documentTouchScroll: !0,
                        advanced: {
                            autoScrollOnFocus: "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
                            updateOnContentResize: !0,
                            updateOnImageLoad: "auto",
                            autoUpdateTimeout: 60
                        },
                        theme: "light",
                        callbacks: {
                            onTotalScrollOffset: 0,
                            onTotalScrollBackOffset: 0,
                            alwaysTriggerOffsets: !0
                        }
                    },
                    s = 0,
                    a = {},
                    l = window.attachEvent && !window.addEventListener ? 1 : 0,
                    c = !1,
                    d = ["mCSB_dragger_onDrag", "mCSB_scrollTools_onDrag", "mCS_img_loaded", "mCS_disabled", "mCS_destroyed", "mCS_no_scrollbar", "mCS-autoHide", "mCS-dir-rtl", "mCS_no_scrollbar_y", "mCS_no_scrollbar_x", "mCS_y_hidden", "mCS_x_hidden", "mCSB_draggerContainer", "mCSB_buttonUp", "mCSB_buttonDown", "mCSB_buttonLeft", "mCSB_buttonRight"],
                    u = {
                        init: function(t) {
                            var t = e.extend(!0, {}, r, t),
                                n = p.call(this);
                            if (t.live) {
                                var l = t.liveSelector || this.selector || o,
                                    c = e(l);
                                if ("off" === t.live) return void h(l);
                                a[l] = setTimeout(function() {
                                    c.mCustomScrollbar(t), "once" === t.live && c.length && h(l)
                                }, 500)
                            } else h(l);
                            return t.setWidth = t.set_width ? t.set_width : t.setWidth, t.setHeight = t.set_height ? t.set_height : t.setHeight, t.axis = t.horizontalScroll ? "x" : v(t.axis), t.scrollInertia = t.scrollInertia > 0 && t.scrollInertia < 17 ? 17 : t.scrollInertia, "object" != typeof t.mouseWheel && 1 == t.mouseWheel && (t.mouseWheel = {
                                enable: !0,
                                scrollAmount: "auto",
                                axis: "y",
                                preventDefault: !1,
                                deltaFactor: "auto",
                                normalizeDelta: !1,
                                invert: !1
                            }), t.mouseWheel.scrollAmount = t.mouseWheelPixels ? t.mouseWheelPixels : t.mouseWheel.scrollAmount, t.mouseWheel.normalizeDelta = t.advanced.normalizeMouseWheelDelta ? t.advanced.normalizeMouseWheelDelta : t.mouseWheel.normalizeDelta, t.scrollButtons.scrollType = m(t.scrollButtons.scrollType), f(t), e(n).each(function() {
                                var n = e(this);
                                if (!n.data(i)) {
                                    n.data(i, {
                                        idx: ++s,
                                        opt: t,
                                        scrollRatio: {
                                            y: null,
                                            x: null
                                        },
                                        overflowed: null,
                                        contentReset: {
                                            y: null,
                                            x: null
                                        },
                                        bindEvents: !1,
                                        tweenRunning: !1,
                                        sequential: {},
                                        langDir: n.css("direction"),
                                        cbOffsets: null,
                                        trigger: null,
                                        poll: {
                                            size: {
                                                o: 0,
                                                n: 0
                                            },
                                            img: {
                                                o: 0,
                                                n: 0
                                            },
                                            change: {
                                                o: 0,
                                                n: 0
                                            }
                                        }
                                    });
                                    var o = n.data(i),
                                        r = o.opt,
                                        a = n.data("mcs-axis"),
                                        l = n.data("mcs-scrollbar-position"),
                                        c = n.data("mcs-theme");
                                    a && (r.axis = a), l && (r.scrollbarPosition = l), c && (r.theme = c, f(r)), g.call(this), o && r.callbacks.onCreate && "function" == typeof r.callbacks.onCreate && r.callbacks.onCreate.call(this), e("#mCSB_" + o.idx + "_container img:not(." + d[2] + ")").addClass(d[2]), u.update.call(null, n)
                                }
                            })
                        },
                        update: function(t, n) {
                            var o = t || p.call(this);
                            return e(o).each(function() {
                                var t = e(this);
                                if (t.data(i)) {
                                    var o = t.data(i),
                                        r = o.opt,
                                        s = e("#mCSB_" + o.idx + "_container"),
                                        a = e("#mCSB_" + o.idx),
                                        l = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")];
                                    if (!s.length) return;
                                    o.tweenRunning && Y(t), n && o && r.callbacks.onBeforeUpdate && "function" == typeof r.callbacks.onBeforeUpdate && r.callbacks.onBeforeUpdate.call(this), t.hasClass(d[3]) && t.removeClass(d[3]), t.hasClass(d[4]) && t.removeClass(d[4]), a.css("max-height", "none"), a.height() !== t.height() && a.css("max-height", t.height()), b.call(this), "y" === r.axis || r.advanced.autoExpandHorizontalScroll || s.css("width", y(s)), o.overflowed = k.call(this), A.call(this), r.autoDraggerLength && x.call(this), C.call(this), _.call(this);
                                    var c = [Math.abs(s[0].offsetTop), Math.abs(s[0].offsetLeft)];
                                    "x" !== r.axis && (o.overflowed[0] ? l[0].height() > l[0].parent().height() ? S.call(this) : (J(t, c[0].toString(), {
                                        dir: "y",
                                        dur: 0,
                                        overwrite: "none"
                                    }), o.contentReset.y = null) : (S.call(this), "y" === r.axis ? T.call(this) : "yx" === r.axis && o.overflowed[1] && J(t, c[1].toString(), {
                                        dir: "x",
                                        dur: 0,
                                        overwrite: "none"
                                    }))), "y" !== r.axis && (o.overflowed[1] ? l[1].width() > l[1].parent().width() ? S.call(this) : (J(t, c[1].toString(), {
                                        dir: "x",
                                        dur: 0,
                                        overwrite: "none"
                                    }), o.contentReset.x = null) : (S.call(this), "x" === r.axis ? T.call(this) : "yx" === r.axis && o.overflowed[0] && J(t, c[0].toString(), {
                                        dir: "y",
                                        dur: 0,
                                        overwrite: "none"
                                    }))), n && o && (2 === n && r.callbacks.onImageLoad && "function" == typeof r.callbacks.onImageLoad ? r.callbacks.onImageLoad.call(this) : 3 === n && r.callbacks.onSelectorChange && "function" == typeof r.callbacks.onSelectorChange ? r.callbacks.onSelectorChange.call(this) : r.callbacks.onUpdate && "function" == typeof r.callbacks.onUpdate && r.callbacks.onUpdate.call(this)), V.call(this)
                                }
                            })
                        },
                        scrollTo: function(t, n) {
                            if (void 0 !== t && null != t) {
                                var o = p.call(this);
                                return e(o).each(function() {
                                    var o = e(this);
                                    if (o.data(i)) {
                                        var r = o.data(i),
                                            s = r.opt,
                                            a = {
                                                trigger: "external",
                                                scrollInertia: s.scrollInertia,
                                                scrollEasing: "mcsEaseInOut",
                                                moveDragger: !1,
                                                timeout: 60,
                                                callbacks: !0,
                                                onStart: !0,
                                                onUpdate: !0,
                                                onComplete: !0
                                            },
                                            l = e.extend(!0, {}, a, n),
                                            c = W.call(this, t),
                                            d = l.scrollInertia > 0 && l.scrollInertia < 17 ? 17 : l.scrollInertia;
                                        c[0] = U.call(this, c[0], "y"), c[1] = U.call(this, c[1], "x"), l.moveDragger && (c[0] *= r.scrollRatio.y, c[1] *= r.scrollRatio.x), l.dur = oe() ? 0 : d, setTimeout(function() {
                                            null !== c[0] && void 0 !== c[0] && "x" !== s.axis && r.overflowed[0] && (l.dir = "y", l.overwrite = "all", J(o, c[0].toString(), l)), null !== c[1] && void 0 !== c[1] && "y" !== s.axis && r.overflowed[1] && (l.dir = "x", l.overwrite = "none", J(o, c[1].toString(), l))
                                        }, l.timeout)
                                    }
                                })
                            }
                        },
                        stop: function() {
                            var t = p.call(this);
                            return e(t).each(function() {
                                var t = e(this);
                                t.data(i) && Y(t)
                            })
                        },
                        disable: function(t) {
                            var n = p.call(this);
                            return e(n).each(function() {
                                var n = e(this);
                                n.data(i) && (n.data(i), V.call(this, "remove"), T.call(this), t && S.call(this), A.call(this, !0), n.addClass(d[3]))
                            })
                        },
                        destroy: function() {
                            var t = p.call(this);
                            return e(t).each(function() {
                                var o = e(this);
                                if (o.data(i)) {
                                    var r = o.data(i),
                                        s = r.opt,
                                        a = e("#mCSB_" + r.idx),
                                        l = e("#mCSB_" + r.idx + "_container"),
                                        c = e(".mCSB_" + r.idx + "_scrollbar");
                                    s.live && h(s.liveSelector || e(t).selector), V.call(this, "remove"), T.call(this), S.call(this), o.removeData(i), Z(this, "mcs"), c.remove(), l.find("img." + d[2]).removeClass(d[2]), a.replaceWith(l.contents()), o.removeClass(n + " _" + i + "_" + r.idx + " " + d[6] + " " + d[7] + " " + d[5] + " " + d[3]).addClass(d[4])
                                }
                            })
                        }
                    },
                    p = function() {
                        return "object" != typeof e(this) || e(this).length < 1 ? o : this
                    },
                    f = function(t) {
                        var n = ["rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark"],
                            i = ["rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark"],
                            o = ["minimal", "minimal-dark"],
                            r = ["minimal", "minimal-dark"],
                            s = ["minimal", "minimal-dark"];
                        t.autoDraggerLength = !(e.inArray(t.theme, n) > -1) && t.autoDraggerLength, t.autoExpandScrollbar = !(e.inArray(t.theme, i) > -1) && t.autoExpandScrollbar, t.scrollButtons.enable = !(e.inArray(t.theme, o) > -1) && t.scrollButtons.enable, t.autoHideScrollbar = e.inArray(t.theme, r) > -1 || t.autoHideScrollbar, t.scrollbarPosition = e.inArray(t.theme, s) > -1 ? "outside" : t.scrollbarPosition
                    },
                    h = function(e) {
                        a[e] && (clearTimeout(a[e]), Z(a, e))
                    },
                    v = function(e) {
                        return "yx" === e || "xy" === e || "auto" === e ? "yx" : "x" === e || "horizontal" === e ? "x" : "y"
                    },
                    m = function(e) {
                        return "stepped" === e || "pixels" === e || "step" === e || "click" === e ? "stepped" : "stepless"
                    },
                    g = function() {
                        var t = e(this),
                            o = t.data(i),
                            r = o.opt,
                            s = r.autoExpandScrollbar ? " " + d[1] + "_expand" : "",
                            a = ["<div id='mCSB_" + o.idx + "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" + o.idx + "_scrollbar mCS-" + r.theme + " mCSB_scrollTools_vertical" + s + "'><div class='" + d[12] + "'><div id='mCSB_" + o.idx + "_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>", "<div id='mCSB_" + o.idx + "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" + o.idx + "_scrollbar mCS-" + r.theme + " mCSB_scrollTools_horizontal" + s + "'><div class='" + d[12] + "'><div id='mCSB_" + o.idx + "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
                            l = "yx" === r.axis ? "mCSB_vertical_horizontal" : "x" === r.axis ? "mCSB_horizontal" : "mCSB_vertical",
                            c = "yx" === r.axis ? a[0] + a[1] : "x" === r.axis ? a[1] : a[0],
                            u = "yx" === r.axis ? "<div id='mCSB_" + o.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : "",
                            p = r.autoHideScrollbar ? " " + d[6] : "",
                            f = "x" !== r.axis && "rtl" === o.langDir ? " " + d[7] : "";
                        r.setWidth && t.css("width", r.setWidth), r.setHeight && t.css("height", r.setHeight), r.setLeft = "y" !== r.axis && "rtl" === o.langDir ? "989999px" : r.setLeft, t.addClass(n + " _" + i + "_" + o.idx + p + f).wrapInner("<div id='mCSB_" + o.idx + "' class='mCustomScrollBox mCS-" + r.theme + " " + l + "'><div id='mCSB_" + o.idx + "_container' class='mCSB_container' style='position:relative; top:" + r.setTop + "; left:" + r.setLeft + ";' dir='" + o.langDir + "' /></div>");
                        var h = e("#mCSB_" + o.idx),
                            v = e("#mCSB_" + o.idx + "_container");
                        "y" === r.axis || r.advanced.autoExpandHorizontalScroll || v.css("width", y(v)), "outside" === r.scrollbarPosition ? ("static" === t.css("position") && t.css("position", "relative"), t.css("overflow", "visible"), h.addClass("mCSB_outside").after(c)) : (h.addClass("mCSB_inside").append(c), v.wrap(u)), w.call(this);
                        var m = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")];
                        m[0].css("min-height", m[0].height()), m[1].css("min-width", m[1].width())
                    },
                    y = function(t) {
                        var n = [t[0].scrollWidth, Math.max.apply(Math, t.children().map(function() {
                                return e(this).outerWidth(!0)
                            }).get())],
                            i = t.parent().width();
                        return n[0] > i ? n[0] : n[1] > i ? n[1] : "100%"
                    },
                    b = function() {
                        var t = e(this),
                            n = t.data(i),
                            o = n.opt,
                            r = e("#mCSB_" + n.idx + "_container");
                        if (o.advanced.autoExpandHorizontalScroll && "y" !== o.axis) {
                            r.css({
                                width: "auto",
                                "min-width": 0,
                                "overflow-x": "scroll"
                            });
                            var s = Math.ceil(r[0].scrollWidth);
                            3 === o.advanced.autoExpandHorizontalScroll || 2 !== o.advanced.autoExpandHorizontalScroll && s > r.parent().width() ? r.css({
                                width: s,
                                "min-width": "100%",
                                "overflow-x": "inherit"
                            }) : r.css({
                                "overflow-x": "inherit",
                                position: "absolute"
                            }).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({
                                width: Math.ceil(r[0].getBoundingClientRect().right + .4) - Math.floor(r[0].getBoundingClientRect().left),
                                "min-width": "100%",
                                position: "relative"
                            }).unwrap()
                        }
                    },
                    w = function() {
                        var t = e(this),
                            n = t.data(i),
                            o = n.opt,
                            r = e(".mCSB_" + n.idx + "_scrollbar:first"),
                            s = ne(o.scrollButtons.tabindex) ? "tabindex='" + o.scrollButtons.tabindex + "'" : "",
                            a = ["<a href='#' class='" + d[13] + "' " + s + " />", "<a href='#' class='" + d[14] + "' " + s + " />", "<a href='#' class='" + d[15] + "' " + s + " />", "<a href='#' class='" + d[16] + "' " + s + " />"],
                            l = ["x" === o.axis ? a[2] : a[0], "x" === o.axis ? a[3] : a[1], a[2], a[3]];
                        o.scrollButtons.enable && r.prepend(l[0]).append(l[1]).next(".mCSB_scrollTools").prepend(l[2]).append(l[3])
                    },
                    x = function() {
                        var t = e(this),
                            n = t.data(i),
                            o = e("#mCSB_" + n.idx),
                            r = e("#mCSB_" + n.idx + "_container"),
                            s = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")],
                            a = [o.height() / r.outerHeight(!1), o.width() / r.outerWidth(!1)],
                            c = [parseInt(s[0].css("min-height")), Math.round(a[0] * s[0].parent().height()), parseInt(s[1].css("min-width")), Math.round(a[1] * s[1].parent().width())],
                            d = l && c[1] < c[0] ? c[0] : c[1],
                            u = l && c[3] < c[2] ? c[2] : c[3];
                        s[0].css({
                            height: d,
                            "max-height": s[0].parent().height() - 10
                        }).find(".mCSB_dragger_bar").css({
                            "line-height": c[0] + "px"
                        }), s[1].css({
                            width: u,
                            "max-width": s[1].parent().width() - 10
                        })
                    },
                    C = function() {
                        var t = e(this),
                            n = t.data(i),
                            o = e("#mCSB_" + n.idx),
                            r = e("#mCSB_" + n.idx + "_container"),
                            s = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")],
                            a = [r.outerHeight(!1) - o.height(), r.outerWidth(!1) - o.width()],
                            l = [a[0] / (s[0].parent().height() - s[0].height()), a[1] / (s[1].parent().width() - s[1].width())];
                        n.scrollRatio = {
                            y: l[0],
                            x: l[1]
                        }
                    },
                    $ = function(e, t, n) {
                        var i = n ? d[0] + "_expanded" : "",
                            o = e.closest(".mCSB_scrollTools");
                        "active" === t ? (e.toggleClass(d[0] + " " + i), o.toggleClass(d[1]), e[0]._draggable = e[0]._draggable ? 0 : 1) : e[0]._draggable || ("hide" === t ? (e.removeClass(d[0]), o.removeClass(d[1])) : (e.addClass(d[0]), o.addClass(d[1])))
                    },
                    k = function() {
                        var t = e(this),
                            n = t.data(i),
                            o = e("#mCSB_" + n.idx),
                            r = e("#mCSB_" + n.idx + "_container"),
                            s = null == n.overflowed ? r.height() : r.outerHeight(!1),
                            a = null == n.overflowed ? r.width() : r.outerWidth(!1),
                            l = r[0].scrollHeight,
                            c = r[0].scrollWidth;
                        return l > s && (s = l), c > a && (a = c), [s > o.height(), a > o.width()]
                    },
                    S = function() {
                        var t = e(this),
                            n = t.data(i),
                            o = n.opt,
                            r = e("#mCSB_" + n.idx),
                            s = e("#mCSB_" + n.idx + "_container"),
                            a = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")];
                        if (Y(t), ("x" !== o.axis && !n.overflowed[0] || "y" === o.axis && n.overflowed[0]) && (a[0].add(s).css("top", 0), J(t, "_resetY")), "y" !== o.axis && !n.overflowed[1] || "x" === o.axis && n.overflowed[1]) {
                            var l = dx = 0;
                            "rtl" === n.langDir && (l = r.width() - s.outerWidth(!1), dx = Math.abs(l / n.scrollRatio.x)), s.css("left", l), a[1].css("left", dx), J(t, "_resetX")
                        }
                    },
                    _ = function() {
                        function t() {
                            s = setTimeout(function() {
                                e.event.special.mousewheel ? (clearTimeout(s), M.call(n[0])) : t()
                            }, 100)
                        }
                        var n = e(this),
                            o = n.data(i),
                            r = o.opt;
                        if (!o.bindEvents) {
                            if (E.call(this), r.contentTouchScroll && j.call(this), O.call(this), r.mouseWheel.enable) {
                                var s;
                                t()
                            }
                            B.call(this), R.call(this), r.advanced.autoScrollOnFocus && H.call(this), r.scrollButtons.enable && q.call(this), r.keyboard.enable && F.call(this), o.bindEvents = !0
                        }
                    },
                    T = function() {
                        var t = e(this),
                            n = t.data(i),
                            o = n.opt,
                            r = i + "_" + n.idx,
                            s = ".mCSB_" + n.idx + "_scrollbar",
                            a = e("#mCSB_" + n.idx + ",#mCSB_" + n.idx + "_container,#mCSB_" + n.idx + "_container_wrapper," + s + " ." + d[12] + ",#mCSB_" + n.idx + "_dragger_vertical,#mCSB_" + n.idx + "_dragger_horizontal," + s + ">a"),
                            l = e("#mCSB_" + n.idx + "_container");
                        o.advanced.releaseDraggableSelectors && a.add(e(o.advanced.releaseDraggableSelectors)), o.advanced.extraDraggableSelectors && a.add(e(o.advanced.extraDraggableSelectors)), n.bindEvents && (e(document).add(e(!P() || top.document)).unbind("." + r), a.each(function() {
                            e(this).unbind("." + r)
                        }), clearTimeout(t[0]._focusTimeout), Z(t[0], "_focusTimeout"), clearTimeout(n.sequential.step), Z(n.sequential, "step"), clearTimeout(l[0].onCompleteTimeout), Z(l[0], "onCompleteTimeout"), n.bindEvents = !1)
                    },
                    A = function(t) {
                        var n = e(this),
                            o = n.data(i),
                            r = o.opt,
                            s = e("#mCSB_" + o.idx + "_container_wrapper"),
                            a = s.length ? s : e("#mCSB_" + o.idx + "_container"),
                            l = [e("#mCSB_" + o.idx + "_scrollbar_vertical"), e("#mCSB_" + o.idx + "_scrollbar_horizontal")],
                            c = [l[0].find(".mCSB_dragger"), l[1].find(".mCSB_dragger")];
                        "x" !== r.axis && (o.overflowed[0] && !t ? (l[0].add(c[0]).add(l[0].children("a")).css("display", "block"), a.removeClass(d[8] + " " + d[10])) : (r.alwaysShowScrollbar ? (2 !== r.alwaysShowScrollbar && c[0].css("display", "none"), a.removeClass(d[10])) : (l[0].css("display", "none"), a.addClass(d[10])), a.addClass(d[8]))), "y" !== r.axis && (o.overflowed[1] && !t ? (l[1].add(c[1]).add(l[1].children("a")).css("display", "block"), a.removeClass(d[9] + " " + d[11])) : (r.alwaysShowScrollbar ? (2 !== r.alwaysShowScrollbar && c[1].css("display", "none"), a.removeClass(d[11])) : (l[1].css("display", "none"), a.addClass(d[11])), a.addClass(d[9]))), o.overflowed[0] || o.overflowed[1] ? n.removeClass(d[5]) : n.addClass(d[5])
                    },
                    D = function(t) {
                        var n = t.type,
                            i = t.target.ownerDocument !== document && null !== frameElement ? [e(frameElement).offset().top, e(frameElement).offset().left] : null,
                            o = P() && t.target.ownerDocument !== top.document && null !== frameElement ? [e(t.view.frameElement).offset().top, e(t.view.frameElement).offset().left] : [0, 0];
                        switch (n) {
                            case "pointerdown":
                            case "MSPointerDown":
                            case "pointermove":
                            case "MSPointerMove":
                            case "pointerup":
                            case "MSPointerUp":
                                return i ? [t.originalEvent.pageY - i[0] + o[0], t.originalEvent.pageX - i[1] + o[1], !1] : [t.originalEvent.pageY, t.originalEvent.pageX, !1];
                            case "touchstart":
                            case "touchmove":
                            case "touchend":
                                var r = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0],
                                    s = t.originalEvent.touches.length || t.originalEvent.changedTouches.length;
                                return t.target.ownerDocument !== document ? [r.screenY, r.screenX, s > 1] : [r.pageY, r.pageX, s > 1];
                            default:
                                return i ? [t.pageY - i[0] + o[0], t.pageX - i[1] + o[1], !1] : [t.pageY, t.pageX, !1]
                        }
                    },
                    E = function() {
                        function t(e, t, i, o) {
                            if (f[0].idleTimer = d.scrollInertia < 233 ? 250 : 0, n.attr("id") === p[1]) var r = "x",
                                l = (n[0].offsetLeft - t + o) * a.scrollRatio.x;
                            else var r = "y",
                                l = (n[0].offsetTop - e + i) * a.scrollRatio.y;
                            J(s, l.toString(), {
                                dir: r,
                                drag: !0
                            })
                        }
                        var n, o, r, s = e(this),
                            a = s.data(i),
                            d = a.opt,
                            u = i + "_" + a.idx,
                            p = ["mCSB_" + a.idx + "_dragger_vertical", "mCSB_" + a.idx + "_dragger_horizontal"],
                            f = e("#mCSB_" + a.idx + "_container"),
                            h = e("#" + p[0] + ",#" + p[1]),
                            v = d.advanced.releaseDraggableSelectors ? h.add(e(d.advanced.releaseDraggableSelectors)) : h,
                            m = d.advanced.extraDraggableSelectors ? e(!P() || top.document).add(e(d.advanced.extraDraggableSelectors)) : e(!P() || top.document);
                        h.bind("contextmenu." + u, function(e) {
                            e.preventDefault()
                        }).bind("mousedown." + u + " touchstart." + u + " pointerdown." + u + " MSPointerDown." + u, function(t) {
                            if (t.stopImmediatePropagation(), t.preventDefault(), ee(t)) {
                                c = !0, l && (document.onselectstart = function() {
                                    return !1
                                }), N.call(f, !1), Y(s), n = e(this);
                                var i = n.offset(),
                                    a = D(t)[0] - i.top,
                                    u = D(t)[1] - i.left,
                                    p = n.height() + i.top,
                                    h = n.width() + i.left;
                                p > a && a > 0 && h > u && u > 0 && (o = a, r = u), $(n, "active", d.autoExpandScrollbar)
                            }
                        }).bind("touchmove." + u, function(e) {
                            e.stopImmediatePropagation(), e.preventDefault();
                            var i = n.offset(),
                                s = D(e)[0] - i.top,
                                a = D(e)[1] - i.left;
                            t(o, r, s, a)
                        }), e(document).add(m).bind("mousemove." + u + " pointermove." + u + " MSPointerMove." + u, function(e) {
                            if (n) {
                                var i = n.offset(),
                                    s = D(e)[0] - i.top,
                                    a = D(e)[1] - i.left;
                                if (o === s && r === a) return;
                                t(o, r, s, a)
                            }
                        }).add(v).bind("mouseup." + u + " touchend." + u + " pointerup." + u + " MSPointerUp." + u, function() {
                            n && ($(n, "active", d.autoExpandScrollbar), n = null), c = !1, l && (document.onselectstart = null), N.call(f, !0)
                        })
                    },
                    j = function() {
                        function n(e) {
                            if (!te(e) || c || D(e)[2]) return void(t = 0);
                            t = 1, C = 0, $ = 0, d = 1, k.removeClass("mCS_touch_action");
                            var n = E.offset();
                            u = D(e)[0] - n.top, p = D(e)[1] - n.left, I = [D(e)[0], D(e)[1]]
                        }

                        function o(e) {
                            if (te(e) && !c && !D(e)[2] && (_.documentTouchScroll || e.preventDefault(), e.stopImmediatePropagation(), (!$ || C) && d)) {
                                m = G();
                                var t = A.offset(),
                                    n = D(e)[0] - t.top,
                                    i = D(e)[1] - t.left,
                                    o = "mcsLinearOut";
                                if (O.push(n), M.push(i), I[2] = Math.abs(D(e)[0] - I[0]), I[3] = Math.abs(D(e)[1] - I[1]), S.overflowed[0]) var r = j[0].parent().height() - j[0].height(),
                                    s = u - n > 0 && n - u > -r * S.scrollRatio.y && (2 * I[3] < I[2] || "yx" === _.axis);
                                if (S.overflowed[1]) var a = j[1].parent().width() - j[1].width(),
                                    f = p - i > 0 && i - p > -a * S.scrollRatio.x && (2 * I[2] < I[3] || "yx" === _.axis);
                                s || f ? (R || e.preventDefault(), C = 1) : ($ = 1, k.addClass("mCS_touch_action")), R && e.preventDefault(), w = "yx" === _.axis ? [u - n, p - i] : "x" === _.axis ? [null, p - i] : [u - n, null], E[0].idleTimer = 250, S.overflowed[0] && l(w[0], L, o, "y", "all", !0), S.overflowed[1] && l(w[1], L, o, "x", N, !0)
                            }
                        }

                        function r(e) {
                            if (!te(e) || c || D(e)[2]) return void(t = 0);
                            t = 1, e.stopImmediatePropagation(), Y(k), v = G();
                            var n = A.offset();
                            f = D(e)[0] - n.top, h = D(e)[1] - n.left, O = [], M = []
                        }

                        function s(e) {
                            if (te(e) && !c && !D(e)[2]) {
                                d = 0, e.stopImmediatePropagation(), C = 0, $ = 0, g = G();
                                var t = A.offset(),
                                    n = D(e)[0] - t.top,
                                    i = D(e)[1] - t.left;
                                if (!(g - m > 30)) {
                                    b = 1e3 / (g - v);
                                    var o = "mcsEaseOut",
                                        r = 2.5 > b,
                                        s = r ? [O[O.length - 2], M[M.length - 2]] : [0, 0];
                                    y = r ? [n - s[0], i - s[1]] : [n - f, i - h];
                                    var u = [Math.abs(y[0]), Math.abs(y[1])];
                                    b = r ? [Math.abs(y[0] / 4), Math.abs(y[1] / 4)] : [b, b];
                                    var p = [Math.abs(E[0].offsetTop) - y[0] * a(u[0] / b[0], b[0]), Math.abs(E[0].offsetLeft) - y[1] * a(u[1] / b[1], b[1])];
                                    w = "yx" === _.axis ? [p[0], p[1]] : "x" === _.axis ? [null, p[1]] : [p[0], null], x = [4 * u[0] + _.scrollInertia, 4 * u[1] + _.scrollInertia];
                                    var k = parseInt(_.contentTouchScroll) || 0;
                                    w[0] = u[0] > k ? w[0] : 0, w[1] = u[1] > k ? w[1] : 0, S.overflowed[0] && l(w[0], x[0], o, "y", N, !1), S.overflowed[1] && l(w[1], x[1], o, "x", N, !1)
                                }
                            }
                        }

                        function a(e, t) {
                            var n = [1.5 * t, 2 * t, t / 1.5, t / 2];
                            return e > 90 ? t > 4 ? n[0] : n[3] : e > 60 ? t > 3 ? n[3] : n[2] : e > 30 ? t > 8 ? n[1] : t > 6 ? n[0] : t > 4 ? t : n[2] : t > 8 ? t : n[3]
                        }

                        function l(e, t, n, i, o, r) {
                            e && J(k, e.toString(), {
                                dur: t,
                                scrollEasing: n,
                                dir: i,
                                overwrite: o,
                                drag: r
                            })
                        }
                        var d, u, p, f, h, v, m, g, y, b, w, x, C, $, k = e(this),
                            S = k.data(i),
                            _ = S.opt,
                            T = i + "_" + S.idx,
                            A = e("#mCSB_" + S.idx),
                            E = e("#mCSB_" + S.idx + "_container"),
                            j = [e("#mCSB_" + S.idx + "_dragger_vertical"), e("#mCSB_" + S.idx + "_dragger_horizontal")],
                            O = [],
                            M = [],
                            L = 0,
                            N = "yx" === _.axis ? "none" : "all",
                            I = [],
                            B = E.find("iframe"),
                            H = ["touchstart." + T + " pointerdown." + T + " MSPointerDown." + T, "touchmove." + T + " pointermove." + T + " MSPointerMove." + T, "touchend." + T + " pointerup." + T + " MSPointerUp." + T],
                            R = void 0 !== document.body.style.touchAction && "" !== document.body.style.touchAction;
                        E.bind(H[0], function(e) {
                            n(e)
                        }).bind(H[1], function(e) {
                            o(e)
                        }), A.bind(H[0], function(e) {
                            r(e)
                        }).bind(H[2], function(e) {
                            s(e)
                        }), B.length && B.each(function() {
                            e(this).bind("load", function() {
                                P(this) && e(this.contentDocument || this.contentWindow.document).bind(H[0], function(e) {
                                    n(e), r(e)
                                }).bind(H[1], function(e) {
                                    o(e)
                                }).bind(H[2], function(e) {
                                    s(e)
                                })
                            })
                        })
                    },
                    O = function() {
                        function n() {
                            return window.getSelection ? window.getSelection().toString() : document.selection && "Control" != document.selection.type ? document.selection.createRange().text : 0
                        }

                        function o(e, t, n) {
                            d.type = n && r ? "stepped" : "stepless", d.scrollAmount = 10, z(s, e, t, "mcsLinearOut", n ? 60 : null)
                        }
                        var r, s = e(this),
                            a = s.data(i),
                            l = a.opt,
                            d = a.sequential,
                            u = i + "_" + a.idx,
                            p = e("#mCSB_" + a.idx + "_container"),
                            f = p.parent();
                        p.bind("mousedown." + u, function() {
                            t || r || (r = 1, c = !0)
                        }).add(document).bind("mousemove." + u, function(e) {
                            if (!t && r && n()) {
                                var i = p.offset(),
                                    s = D(e)[0] - i.top + p[0].offsetTop,
                                    c = D(e)[1] - i.left + p[0].offsetLeft;
                                s > 0 && s < f.height() && c > 0 && c < f.width() ? d.step && o("off", null, "stepped") : ("x" !== l.axis && a.overflowed[0] && (0 > s ? o("on", 38) : s > f.height() && o("on", 40)), "y" !== l.axis && a.overflowed[1] && (0 > c ? o("on", 37) : c > f.width() && o("on", 39)))
                            }
                        }).bind("mouseup." + u + " dragend." + u, function() {
                            t || (r && (r = 0, o("off", null)), c = !1)
                        })
                    },
                    M = function() {
                        function t(t, i) {
                            if (Y(n), !I(n, t.target)) {
                                var s = "auto" !== r.mouseWheel.deltaFactor ? parseInt(r.mouseWheel.deltaFactor) : l && t.deltaFactor < 100 ? 100 : t.deltaFactor || 100,
                                    d = r.scrollInertia;
                                if ("x" === r.axis || "x" === r.mouseWheel.axis) var u = "x",
                                    p = [Math.round(s * o.scrollRatio.x), parseInt(r.mouseWheel.scrollAmount)],
                                    f = "auto" !== r.mouseWheel.scrollAmount ? p[1] : p[0] >= a.width() ? .9 * a.width() : p[0],
                                    h = Math.abs(e("#mCSB_" + o.idx + "_container")[0].offsetLeft),
                                    v = c[1][0].offsetLeft,
                                    m = c[1].parent().width() - c[1].width(),
                                    g = "y" === r.mouseWheel.axis ? t.deltaY || i : t.deltaX;
                                else var u = "y",
                                    p = [Math.round(s * o.scrollRatio.y), parseInt(r.mouseWheel.scrollAmount)],
                                    f = "auto" !== r.mouseWheel.scrollAmount ? p[1] : p[0] >= a.height() ? .9 * a.height() : p[0],
                                    h = Math.abs(e("#mCSB_" + o.idx + "_container")[0].offsetTop),
                                    v = c[0][0].offsetTop,
                                    m = c[0].parent().height() - c[0].height(),
                                    g = t.deltaY || i;
                                "y" === u && !o.overflowed[0] || "x" === u && !o.overflowed[1] || ((r.mouseWheel.invert || t.webkitDirectionInvertedFromDevice) && (g = -g), r.mouseWheel.normalizeDelta && (g = 0 > g ? -1 : 1), (g > 0 && 0 !== v || 0 > g && v !== m || r.mouseWheel.preventDefault) && (t.stopImmediatePropagation(), t.preventDefault()), t.deltaFactor < 5 && !r.mouseWheel.normalizeDelta && (f = t.deltaFactor, d = 17), J(n, (h - g * f).toString(), {
                                    dir: u,
                                    dur: d
                                }))
                            }
                        }
                        if (e(this).data(i)) {
                            var n = e(this),
                                o = n.data(i),
                                r = o.opt,
                                s = i + "_" + o.idx,
                                a = e("#mCSB_" + o.idx),
                                c = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")],
                                d = e("#mCSB_" + o.idx + "_container").find("iframe");
                            d.length && d.each(function() {
                                e(this).bind("load", function() {
                                    P(this) && e(this.contentDocument || this.contentWindow.document).bind("mousewheel." + s, function(e, n) {
                                        t(e, n)
                                    })
                                })
                            }), a.bind("mousewheel." + s, function(e, n) {
                                t(e, n)
                            })
                        }
                    },
                    L = new Object,
                    P = function(t) {
                        var n = !1,
                            i = !1,
                            o = null;
                        if (void 0 === t ? i = "#empty" : void 0 !== e(t).attr("id") && (i = e(t).attr("id")), !1 !== i && void 0 !== L[i]) return L[i];
                        if (t) {
                            try {
                                var r = t.contentDocument || t.contentWindow.document;
                                o = r.body.innerHTML
                            } catch (e) {}
                            n = null !== o
                        } else {
                            try {
                                var r = top.document;
                                o = r.body.innerHTML
                            } catch (e) {}
                            n = null !== o
                        }
                        return !1 !== i && (L[i] = n), n
                    },
                    N = function(e) {
                        var t = this.find("iframe");
                        if (t.length) {
                            var n = e ? "auto" : "none";
                            t.css("pointer-events", n)
                        }
                    },
                    I = function(t, n) {
                        var o = n.nodeName.toLowerCase(),
                            r = t.data(i).opt.mouseWheel.disableOver,
                            s = ["select", "textarea"];
                        return e.inArray(o, r) > -1 && !(e.inArray(o, s) > -1 && !e(n).is(":focus"))
                    },
                    B = function() {
                        var t, n = e(this),
                            o = n.data(i),
                            r = i + "_" + o.idx,
                            s = e("#mCSB_" + o.idx + "_container"),
                            a = s.parent();
                        e(".mCSB_" + o.idx + "_scrollbar ." + d[12]).bind("mousedown." + r + " touchstart." + r + " pointerdown." + r + " MSPointerDown." + r, function(n) {
                            c = !0, e(n.target).hasClass("mCSB_dragger") || (t = 1)
                        }).bind("touchend." + r + " pointerup." + r + " MSPointerUp." + r, function() {
                            c = !1
                        }).bind("click." + r, function(i) {
                            if (t && (t = 0, e(i.target).hasClass(d[12]) || e(i.target).hasClass("mCSB_draggerRail"))) {
                                Y(n);
                                var r = e(this),
                                    l = r.find(".mCSB_dragger");
                                if (r.parent(".mCSB_scrollTools_horizontal").length > 0) {
                                    if (!o.overflowed[1]) return;
                                    var c = "x",
                                        u = i.pageX > l.offset().left ? -1 : 1,
                                        p = Math.abs(s[0].offsetLeft) - u * (.9 * a.width())
                                } else {
                                    if (!o.overflowed[0]) return;
                                    var c = "y",
                                        u = i.pageY > l.offset().top ? -1 : 1,
                                        p = Math.abs(s[0].offsetTop) - u * (.9 * a.height())
                                }
                                J(n, p.toString(), {
                                    dir: c,
                                    scrollEasing: "mcsEaseInOut"
                                })
                            }
                        })
                    },
                    H = function() {
                        var t = e(this),
                            n = t.data(i),
                            o = n.opt,
                            r = i + "_" + n.idx,
                            s = e("#mCSB_" + n.idx + "_container"),
                            a = s.parent();
                        s.bind("focusin." + r, function() {
                            var n = e(document.activeElement),
                                i = s.find(".mCustomScrollBox").length;
                            n.is(o.advanced.autoScrollOnFocus) && (Y(t), clearTimeout(t[0]._focusTimeout), t[0]._focusTimer = i ? 17 * i : 0, t[0]._focusTimeout = setTimeout(function() {
                                var e = [ie(n)[0], ie(n)[1]],
                                    i = [s[0].offsetTop, s[0].offsetLeft],
                                    r = [i[0] + e[0] >= 0 && i[0] + e[0] < a.height() - n.outerHeight(!1), i[1] + e[1] >= 0 && i[0] + e[1] < a.width() - n.outerWidth(!1)],
                                    l = "yx" !== o.axis || r[0] || r[1] ? "all" : "none";
                                "x" === o.axis || r[0] || J(t, e[0].toString(), {
                                    dir: "y",
                                    scrollEasing: "mcsEaseInOut",
                                    overwrite: l,
                                    dur: 0
                                }), "y" === o.axis || r[1] || J(t, e[1].toString(), {
                                    dir: "x",
                                    scrollEasing: "mcsEaseInOut",
                                    overwrite: l,
                                    dur: 0
                                })
                            }, t[0]._focusTimer))
                        })
                    },
                    R = function() {
                        var t = e(this),
                            n = t.data(i),
                            o = i + "_" + n.idx,
                            r = e("#mCSB_" + n.idx + "_container").parent();
                        r.bind("scroll." + o, function() {
                            0 === r.scrollTop() && 0 === r.scrollLeft() || e(".mCSB_" + n.idx + "_scrollbar").css("visibility", "hidden")
                        })
                    },
                    q = function() {
                        var t = e(this),
                            n = t.data(i),
                            o = n.opt,
                            r = n.sequential,
                            s = i + "_" + n.idx,
                            a = ".mCSB_" + n.idx + "_scrollbar";
                        e(a + ">a").bind("contextmenu." + s, function(e) {
                            e.preventDefault()
                        }).bind("mousedown." + s + " touchstart." + s + " pointerdown." + s + " MSPointerDown." + s + " mouseup." + s + " touchend." + s + " pointerup." + s + " MSPointerUp." + s + " mouseout." + s + " pointerout." + s + " MSPointerOut." + s + " click." + s, function(i) {
                            function s(e, n) {
                                r.scrollAmount = o.scrollButtons.scrollAmount, z(t, e, n)
                            }
                            if (i.preventDefault(), ee(i)) {
                                var a = e(this).attr("class");
                                switch (r.type = o.scrollButtons.scrollType, i.type) {
                                    case "mousedown":
                                    case "touchstart":
                                    case "pointerdown":
                                    case "MSPointerDown":
                                        if ("stepped" === r.type) return;
                                        c = !0, n.tweenRunning = !1, s("on", a);
                                        break;
                                    case "mouseup":
                                    case "touchend":
                                    case "pointerup":
                                    case "MSPointerUp":
                                    case "mouseout":
                                    case "pointerout":
                                    case "MSPointerOut":
                                        if ("stepped" === r.type) return;
                                        c = !1, r.dir && s("off", a);
                                        break;
                                    case "click":
                                        if ("stepped" !== r.type || n.tweenRunning) return;
                                        s("on", a)
                                }
                            }
                        })
                    },
                    F = function() {
                        function t(t) {
                            function i(e, t) {
                                s.type = r.keyboard.scrollType, s.scrollAmount = r.keyboard.scrollAmount, "stepped" === s.type && o.tweenRunning || z(n, e, t)
                            }
                            switch (t.type) {
                                case "blur":
                                    o.tweenRunning && s.dir && i("off", null);
                                    break;
                                case "keydown":
                                case "keyup":
                                    var a = t.keyCode ? t.keyCode : t.which,
                                        l = "on";
                                    if ("x" !== r.axis && (38 === a || 40 === a) || "y" !== r.axis && (37 === a || 39 === a)) {
                                        if ((38 === a || 40 === a) && !o.overflowed[0] || (37 === a || 39 === a) && !o.overflowed[1]) return;
                                        "keyup" === t.type && (l = "off"), e(document.activeElement).is(u) || (t.preventDefault(), t.stopImmediatePropagation(), i(l, a))
                                    } else if (33 === a || 34 === a) {
                                        if ((o.overflowed[0] || o.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type) {
                                            Y(n);
                                            var p = 34 === a ? -1 : 1;
                                            if ("x" === r.axis || "yx" === r.axis && o.overflowed[1] && !o.overflowed[0]) var f = "x",
                                                h = Math.abs(c[0].offsetLeft) - p * (.9 * d.width());
                                            else var f = "y",
                                                h = Math.abs(c[0].offsetTop) - p * (.9 * d.height());
                                            J(n, h.toString(), {
                                                dir: f,
                                                scrollEasing: "mcsEaseInOut"
                                            })
                                        }
                                    } else if ((35 === a || 36 === a) && !e(document.activeElement).is(u) && ((o.overflowed[0] || o.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type)) {
                                        if ("x" === r.axis || "yx" === r.axis && o.overflowed[1] && !o.overflowed[0]) var f = "x",
                                            h = 35 === a ? Math.abs(d.width() - c.outerWidth(!1)) : 0;
                                        else var f = "y",
                                            h = 35 === a ? Math.abs(d.height() - c.outerHeight(!1)) : 0;
                                        J(n, h.toString(), {
                                            dir: f,
                                            scrollEasing: "mcsEaseInOut"
                                        })
                                    }
                            }
                        }
                        var n = e(this),
                            o = n.data(i),
                            r = o.opt,
                            s = o.sequential,
                            a = i + "_" + o.idx,
                            l = e("#mCSB_" + o.idx),
                            c = e("#mCSB_" + o.idx + "_container"),
                            d = c.parent(),
                            u = "input,textarea,select,datalist,keygen,[contenteditable='true']",
                            p = c.find("iframe"),
                            f = ["blur." + a + " keydown." + a + " keyup." + a];
                        p.length && p.each(function() {
                            e(this).bind("load", function() {
                                P(this) && e(this.contentDocument || this.contentWindow.document).bind(f[0], function(e) {
                                    t(e)
                                })
                            })
                        }), l.attr("tabindex", "0").bind(f[0], function(e) {
                            t(e)
                        })
                    },
                    z = function(t, n, o, r, s) {
                        function a(e) {
                            c.snapAmount && (u.scrollAmount = c.snapAmount instanceof Array ? "x" === u.dir[0] ? c.snapAmount[1] : c.snapAmount[0] : c.snapAmount);
                            var n = "stepped" !== u.type,
                                i = s || (e ? n ? h / 1.5 : v : 1e3 / 60),
                                o = e ? n ? 7.5 : 40 : 2.5,
                                d = [Math.abs(p[0].offsetTop), Math.abs(p[0].offsetLeft)],
                                f = [l.scrollRatio.y > 10 ? 10 : l.scrollRatio.y, l.scrollRatio.x > 10 ? 10 : l.scrollRatio.x],
                                m = "x" === u.dir[0] ? d[1] + u.dir[1] * (f[1] * o) : d[0] + u.dir[1] * (f[0] * o),
                                g = "x" === u.dir[0] ? d[1] + u.dir[1] * parseInt(u.scrollAmount) : d[0] + u.dir[1] * parseInt(u.scrollAmount),
                                y = "auto" !== u.scrollAmount ? g : m,
                                b = r || (e ? n ? "mcsLinearOut" : "mcsEaseInOut" : "mcsLinear"),
                                w = !!e;
                            return e && 17 > i && (y = "x" === u.dir[0] ? d[1] : d[0]), J(t, y.toString(), {
                                dir: u.dir[0],
                                scrollEasing: b,
                                dur: i,
                                onComplete: w
                            }), e ? void(u.dir = !1) : (clearTimeout(u.step), void(u.step = setTimeout(function() {
                                a()
                            }, i)))
                        }
                        var l = t.data(i),
                            c = l.opt,
                            u = l.sequential,
                            p = e("#mCSB_" + l.idx + "_container"),
                            f = "stepped" === u.type,
                            h = c.scrollInertia < 26 ? 26 : c.scrollInertia,
                            v = c.scrollInertia < 1 ? 17 : c.scrollInertia;
                        switch (n) {
                            case "on":
                                if (u.dir = [o === d[16] || o === d[15] || 39 === o || 37 === o ? "x" : "y", o === d[13] || o === d[15] || 38 === o || 37 === o ? -1 : 1], Y(t), ne(o) && "stepped" === u.type) return;
                                a(f);
                                break;
                            case "off":
                                (function() {
                                    clearTimeout(u.step), Z(u, "step"), Y(t)
                                })(), (f || l.tweenRunning && u.dir) && a(!0)
                        }
                    },
                    W = function(t) {
                        var n = e(this).data(i).opt,
                            o = [];
                        return "function" == typeof t && (t = t()), t instanceof Array ? o = t.length > 1 ? [t[0], t[1]] : "x" === n.axis ? [null, t[0]] : [t[0], null] : (o[0] = t.y ? t.y : t.x || "x" === n.axis ? null : t, o[1] = t.x ? t.x : t.y || "y" === n.axis ? null : t), "function" == typeof o[0] && (o[0] = o[0]()), "function" == typeof o[1] && (o[1] = o[1]()), o
                    },
                    U = function(t, n) {
                        if (null != t && void 0 !== t) {
                            var o = e(this),
                                r = o.data(i),
                                s = r.opt,
                                a = e("#mCSB_" + r.idx + "_container"),
                                l = a.parent(),
                                c = typeof t;
                            n || (n = "x" === s.axis ? "x" : "y");
                            var d = "x" === n ? a.outerWidth(!1) - l.width() : a.outerHeight(!1) - l.height(),
                                p = "x" === n ? a[0].offsetLeft : a[0].offsetTop,
                                f = "x" === n ? "left" : "top";
                            switch (c) {
                                case "function":
                                    return t();
                                case "object":
                                    var h = t.jquery ? t : e(t);
                                    if (!h.length) return;
                                    return "x" === n ? ie(h)[1] : ie(h)[0];
                                case "string":
                                case "number":
                                    if (ne(t)) return Math.abs(t);
                                    if (-1 !== t.indexOf("%")) return Math.abs(d * parseInt(t) / 100);
                                    if (-1 !== t.indexOf("-=")) return Math.abs(p - parseInt(t.split("-=")[1]));
                                    if (-1 !== t.indexOf("+=")) {
                                        var v = p + parseInt(t.split("+=")[1]);
                                        return v >= 0 ? 0 : Math.abs(v)
                                    }
                                    if (-1 !== t.indexOf("px") && ne(t.split("px")[0])) return Math.abs(t.split("px")[0]);
                                    if ("top" === t || "left" === t) return 0;
                                    if ("bottom" === t) return Math.abs(l.height() - a.outerHeight(!1));
                                    if ("right" === t) return Math.abs(l.width() - a.outerWidth(!1));
                                    if ("first" === t || "last" === t) {
                                        var h = a.find(":" + t);
                                        return "x" === n ? ie(h)[1] : ie(h)[0]
                                    }
                                    return e(t).length ? "x" === n ? ie(e(t))[1] : ie(e(t))[0] : (a.css(f, t), void u.update.call(null, o[0]))
                            }
                        }
                    },
                    V = function(t) {
                        function n() {
                            return clearTimeout(p[0].autoUpdate), 0 === a.parents("html").length ? void(a = null) : void(p[0].autoUpdate = setTimeout(function() {
                                return c.advanced.updateOnSelectorChange && (l.poll.change.n = r(), l.poll.change.n !== l.poll.change.o) ? (l.poll.change.o = l.poll.change.n, void s(3)) : c.advanced.updateOnContentResize && (l.poll.size.n = a[0].scrollHeight + a[0].scrollWidth + p[0].offsetHeight + a[0].offsetHeight + a[0].offsetWidth, l.poll.size.n !== l.poll.size.o) ? (l.poll.size.o = l.poll.size.n, void s(1)) : !c.advanced.updateOnImageLoad || "auto" === c.advanced.updateOnImageLoad && "y" === c.axis || (l.poll.img.n = p.find("img").length, l.poll.img.n === l.poll.img.o) ? void((c.advanced.updateOnSelectorChange || c.advanced.updateOnContentResize || c.advanced.updateOnImageLoad) && n()) : (l.poll.img.o = l.poll.img.n, void p.find("img").each(function() {
                                    o(this)
                                }))
                            }, c.advanced.autoUpdateTimeout))
                        }

                        function o(t) {
                            function n() {
                                this.onload = null, e(t).addClass(d[2]), s(2)
                            }
                            if (e(t).hasClass(d[2])) return void s();
                            var i = new Image;
                            i.onload = function(e, t) {
                                return function() {
                                    return t.apply(e, arguments)
                                }
                            }(i, n), i.src = t.src
                        }

                        function r() {
                            !0 === c.advanced.updateOnSelectorChange && (c.advanced.updateOnSelectorChange = "*");
                            var e = 0,
                                t = p.find(c.advanced.updateOnSelectorChange);
                            return c.advanced.updateOnSelectorChange && t.length > 0 && t.each(function() {
                                e += this.offsetHeight + this.offsetWidth
                            }), e
                        }

                        function s(e) {
                            clearTimeout(p[0].autoUpdate), u.update.call(null, a[0], e)
                        }
                        var a = e(this),
                            l = a.data(i),
                            c = l.opt,
                            p = e("#mCSB_" + l.idx + "_container");
                        return t ? (clearTimeout(p[0].autoUpdate), void Z(p[0], "autoUpdate")) : void n()
                    },
                    X = function(e, t, n) {
                        return Math.round(e / t) * t - n
                    },
                    Y = function(t) {
                        var n = t.data(i);
                        e("#mCSB_" + n.idx + "_container,#mCSB_" + n.idx + "_container_wrapper,#mCSB_" + n.idx + "_dragger_vertical,#mCSB_" + n.idx + "_dragger_horizontal").each(function() {
                            Q.call(this)
                        })
                    },
                    J = function(t, n, o) {
                        function r(e) {
                            return l && c.callbacks[e] && "function" == typeof c.callbacks[e]
                        }

                        function s() {
                            return [c.callbacks.alwaysTriggerOffsets || w >= x[0] + k, c.callbacks.alwaysTriggerOffsets || -S >= w]
                        }

                        function a() {
                            var e = [f[0].offsetTop, f[0].offsetLeft],
                                n = [y[0].offsetTop, y[0].offsetLeft],
                                i = [f.outerHeight(!1), f.outerWidth(!1)],
                                r = [p.height(), p.width()];
                            t[0].mcs = {
                                content: f,
                                top: e[0],
                                left: e[1],
                                draggerTop: n[0],
                                draggerLeft: n[1],
                                topPct: Math.round(100 * Math.abs(e[0]) / (Math.abs(i[0]) - r[0])),
                                leftPct: Math.round(100 * Math.abs(e[1]) / (Math.abs(i[1]) - r[1])),
                                direction: o.dir
                            }
                        }
                        var l = t.data(i),
                            c = l.opt,
                            d = {
                                trigger: "internal",
                                dir: "y",
                                scrollEasing: "mcsEaseOut",
                                drag: !1,
                                dur: c.scrollInertia,
                                overwrite: "all",
                                callbacks: !0,
                                onStart: !0,
                                onUpdate: !0,
                                onComplete: !0
                            },
                            o = e.extend(d, o),
                            u = [o.dur, o.drag ? 0 : o.dur],
                            p = e("#mCSB_" + l.idx),
                            f = e("#mCSB_" + l.idx + "_container"),
                            h = f.parent(),
                            v = c.callbacks.onTotalScrollOffset ? W.call(t, c.callbacks.onTotalScrollOffset) : [0, 0],
                            m = c.callbacks.onTotalScrollBackOffset ? W.call(t, c.callbacks.onTotalScrollBackOffset) : [0, 0];
                        if (l.trigger = o.trigger, 0 === h.scrollTop() && 0 === h.scrollLeft() || (e(".mCSB_" + l.idx + "_scrollbar").css("visibility", "visible"), h.scrollTop(0).scrollLeft(0)), "_resetY" !== n || l.contentReset.y || (r("onOverflowYNone") && c.callbacks.onOverflowYNone.call(t[0]), l.contentReset.y = 1), "_resetX" !== n || l.contentReset.x || (r("onOverflowXNone") && c.callbacks.onOverflowXNone.call(t[0]), l.contentReset.x = 1), "_resetY" !== n && "_resetX" !== n) {
                            if (!l.contentReset.y && t[0].mcs || !l.overflowed[0] || (r("onOverflowY") && c.callbacks.onOverflowY.call(t[0]), l.contentReset.x = null), !l.contentReset.x && t[0].mcs || !l.overflowed[1] || (r("onOverflowX") && c.callbacks.onOverflowX.call(t[0]), l.contentReset.x = null), c.snapAmount) {
                                var g = c.snapAmount instanceof Array ? "x" === o.dir ? c.snapAmount[1] : c.snapAmount[0] : c.snapAmount;
                                n = X(n, g, c.snapOffset)
                            }
                            switch (o.dir) {
                                case "x":
                                    var y = e("#mCSB_" + l.idx + "_dragger_horizontal"),
                                        b = "left",
                                        w = f[0].offsetLeft,
                                        x = [p.width() - f.outerWidth(!1), y.parent().width() - y.width()],
                                        C = [n, 0 === n ? 0 : n / l.scrollRatio.x],
                                        k = v[1],
                                        S = m[1],
                                        _ = k > 0 ? k / l.scrollRatio.x : 0,
                                        T = S > 0 ? S / l.scrollRatio.x : 0;
                                    break;
                                case "y":
                                    var y = e("#mCSB_" + l.idx + "_dragger_vertical"),
                                        b = "top",
                                        w = f[0].offsetTop,
                                        x = [p.height() - f.outerHeight(!1), y.parent().height() - y.height()],
                                        C = [n, 0 === n ? 0 : n / l.scrollRatio.y],
                                        k = v[0],
                                        S = m[0],
                                        _ = k > 0 ? k / l.scrollRatio.y : 0,
                                        T = S > 0 ? S / l.scrollRatio.y : 0
                            }
                            C[1] < 0 || 0 === C[0] && 0 === C[1] ? C = [0, 0] : C[1] >= x[1] ? C = [x[0], x[1]] : C[0] = -C[0], t[0].mcs || (a(), r("onInit") && c.callbacks.onInit.call(t[0])), clearTimeout(f[0].onCompleteTimeout), K(y[0], b, Math.round(C[1]), u[1], o.scrollEasing), !l.tweenRunning && (0 === w && C[0] >= 0 || w === x[0] && C[0] <= x[0]) || K(f[0], b, Math.round(C[0]), u[0], o.scrollEasing, o.overwrite, {
                                onStart: function() {
                                    o.callbacks && o.onStart && !l.tweenRunning && (r("onScrollStart") && (a(), c.callbacks.onScrollStart.call(t[0])), l.tweenRunning = !0, $(y), l.cbOffsets = s())
                                },
                                onUpdate: function() {
                                    o.callbacks && o.onUpdate && r("whileScrolling") && (a(), c.callbacks.whileScrolling.call(t[0]))
                                },
                                onComplete: function() {
                                    if (o.callbacks && o.onComplete) {
                                        "yx" === c.axis && clearTimeout(f[0].onCompleteTimeout);
                                        var e = f[0].idleTimer || 0;
                                        f[0].onCompleteTimeout = setTimeout(function() {
                                            r("onScroll") && (a(), c.callbacks.onScroll.call(t[0])), r("onTotalScroll") && C[1] >= x[1] - _ && l.cbOffsets[0] && (a(), c.callbacks.onTotalScroll.call(t[0])), r("onTotalScrollBack") && C[1] <= T && l.cbOffsets[1] && (a(), c.callbacks.onTotalScrollBack.call(t[0])), l.tweenRunning = !1, f[0].idleTimer = 0, $(y, "hide")
                                        }, e)
                                    }
                                }
                            })
                        }
                    },
                    K = function(e, t, n, i, o, r, s) {
                        function a() {
                            b.stop || (m || p.call(), m = G() - v, l(), m >= b.time && (b.time = m > b.time ? m + d - (m - b.time) : m + d - 1, b.time < m + 1 && (b.time = m + 1)), b.time < i ? b.id = u(a) : h.call())
                        }

                        function l() {
                            i > 0 ? (b.currVal = c(b.time, g, w, i, o), y[t] = Math.round(b.currVal) + "px") : y[t] = n + "px", f.call()
                        }

                        function c(e, t, n, i, o) {
                            switch (o) {
                                case "linear":
                                case "mcsLinear":
                                    return n * e / i + t;
                                case "mcsLinearOut":
                                    return e /= i, e--, n * Math.sqrt(1 - e * e) + t;
                                case "easeInOutSmooth":
                                    return e /= i / 2, 1 > e ? n / 2 * e * e + t : (e--, -n / 2 * (e * (e - 2) - 1) + t);
                                case "easeInOutStrong":
                                    return e /= i / 2, 1 > e ? n / 2 * Math.pow(2, 10 * (e - 1)) + t : (e--, n / 2 * (2 - Math.pow(2, -10 * e)) + t);
                                case "easeInOut":
                                case "mcsEaseInOut":
                                    return e /= i / 2, 1 > e ? n / 2 * e * e * e + t : (e -= 2, n / 2 * (e * e * e + 2) + t);
                                case "easeOutSmooth":
                                    return e /= i, e--, -n * (e * e * e * e - 1) + t;
                                case "easeOutStrong":
                                    return n * (1 - Math.pow(2, -10 * e / i)) + t;
                                case "easeOut":
                                case "mcsEaseOut":
                                default:
                                    var r = (e /= i) * e,
                                        s = r * e;
                                    return t + n * (.499999999999997 * s * r + -2.5 * r * r + 5.5 * s + -6.5 * r + 4 * e)
                            }
                        }
                        e._mTween || (e._mTween = {
                            top: {},
                            left: {}
                        });
                        var d, u, s = s || {},
                            p = s.onStart || function() {},
                            f = s.onUpdate || function() {},
                            h = s.onComplete || function() {},
                            v = G(),
                            m = 0,
                            g = e.offsetTop,
                            y = e.style,
                            b = e._mTween[t];
                        "left" === t && (g = e.offsetLeft);
                        var w = n - g;
                        b.stop = 0, "none" !== r && function() {
                                null != b.id && (window.requestAnimationFrame ? window.cancelAnimationFrame(b.id) : clearTimeout(b.id), b.id = null)
                            }(),
                            function() {
                                d = 1e3 / 60, b.time = m + d, u = window.requestAnimationFrame ? window.requestAnimationFrame : function(e) {
                                    return l(), setTimeout(e, .01)
                                }, b.id = u(a)
                            }()
                    },
                    G = function() {
                        return window.performance && window.performance.now ? window.performance.now() : window.performance && window.performance.webkitNow ? window.performance.webkitNow() : Date.now ? Date.now() : (new Date).getTime()
                    },
                    Q = function() {
                        var e = this;
                        e._mTween || (e._mTween = {
                            top: {},
                            left: {}
                        });
                        for (var t = ["top", "left"], n = 0; n < t.length; n++) {
                            var i = t[n];
                            e._mTween[i].id && (window.requestAnimationFrame ? window.cancelAnimationFrame(e._mTween[i].id) : clearTimeout(e._mTween[i].id), e._mTween[i].id = null, e._mTween[i].stop = 1)
                        }
                    },
                    Z = function(e, t) {
                        try {
                            delete e[t]
                        } catch (n) {
                            e[t] = null
                        }
                    },
                    ee = function(e) {
                        return !(e.which && 1 !== e.which)
                    },
                    te = function(e) {
                        var t = e.originalEvent.pointerType;
                        return !(t && "touch" !== t && 2 !== t)
                    },
                    ne = function(e) {
                        return !isNaN(parseFloat(e)) && isFinite(e)
                    },
                    ie = function(e) {
                        var t = e.parents(".mCSB_container");
                        return [e.offset().top - t.offset().top, e.offset().left - t.offset().left]
                    },
                    oe = function() {
                        var e = function() {
                            var e = ["webkit", "moz", "ms", "o"];
                            if ("hidden" in document) return "hidden";
                            for (var t = 0; t < e.length; t++)
                                if (e[t] + "Hidden" in document) return e[t] + "Hidden";
                            return null
                        }();
                        return !!e && document[e]
                    };
                e.fn[n] = function(t) {
                    return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments)
                }, e[n] = function(t) {
                    return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments)
                }, e[n].defaults = r, window[n] = !0, e(window).bind("load", function() {
                    e(o)[n](), e.extend(e.expr[":"], {
                        mcsInView: e.expr[":"].mcsInView || function(t) {
                            var n, i, o = e(t),
                                r = o.parents(".mCSB_container");
                            if (r.length) return n = r.parent(), i = [r[0].offsetTop, r[0].offsetLeft], i[0] + ie(o)[0] >= 0 && i[0] + ie(o)[0] < n.height() - o.outerHeight(!1) && i[1] + ie(o)[1] >= 0 && i[1] + ie(o)[1] < n.width() - o.outerWidth(!1)
                        },
                        mcsInSight: e.expr[":"].mcsInSight || function(t, n, i) {
                            var o, r, s, a, l = e(t),
                                c = l.parents(".mCSB_container"),
                                d = "exact" === i[3] ? [
                                    [1, 0],
                                    [1, 0]
                                ] : [
                                    [.9, .1],
                                    [.6, .4]
                                ];
                            if (c.length) return o = [l.outerHeight(!1), l.outerWidth(!1)], s = [c[0].offsetTop + ie(l)[0], c[0].offsetLeft + ie(l)[1]], r = [c.parent()[0].offsetHeight, c.parent()[0].offsetWidth], a = [o[0] < r[0] ? d[0] : d[1], o[1] < r[1] ? d[0] : d[1]], s[0] - r[0] * a[0][0] < 0 && s[0] + o[0] - r[0] * a[0][1] >= 0 && s[1] - r[1] * a[1][0] < 0 && s[1] + o[1] - r[1] * a[1][1] >= 0
                        },
                        mcsOverflow: e.expr[":"].mcsOverflow || function(t) {
                            var n = e(t).data(i);
                            if (n) return n.overflowed[0] || n.overflowed[1]
                        }
                    })
                })
            }()
    }()
}),
function(e) {
    e.fn.mask = function(t) {
        var n, i, o = !1,
            r = function(e) {
                f[0].selectionStart = f[0].selectionEnd = e
            },
            s = function(e) {
                return void 0 !== e && (e < n || "_" == l(e, !0).value ? e = a() : "9" != l(e).mask && "#" != l(e).mask && (e = l(e, !0).cursor)), void 0 !== e && e >= n && e <= a() ? e : a()
            },
            a = function() {
                var e = t.split(""),
                    n = "" == f.val() ? d().split("") : f.val().split(""),
                    i = 0;
                for (var o in e)
                    if (("#" == e[o] || "9" == e[o]) && "_" == n[o]) {
                        i = parseInt(o);
                        break
                    }
                return ("#" != e[0] && "9" != e[0] || "_" != n[0]) && 0 === i ? e.length : i
            },
            l = function(e, n) {
                n = void 0 !== n && n;
                var i = t.split(""),
                    o = f.val().split("");
                for (var r in i)
                    if (parseInt(r) >= e) {
                        if (!1 === n) return {
                            cursor: parseInt(r) + 1,
                            value: o[r],
                            mask: i[r]
                        };
                        if ("9" == i[r] || "#" == i[r]) return {
                            cursor: parseInt(r),
                            value: o[r],
                            mask: i[r]
                        }
                    }
                return {
                    cursor: i.length + 1,
                    value: null,
                    mask: null
                }
            },
            c = function(e, n) {
                n = void 0 !== n && n;
                for (var i = t.split(""), o = f.val().split(""), r = i.length - 1; r >= 0; r--)
                    if (parseInt(r) < e) {
                        if (!1 === n) return {
                            cursor: parseInt(r),
                            value: o[r],
                            mask: i[r]
                        };
                        if ("9" == i[r] || "#" == i[r]) return {
                            cursor: parseInt(r),
                            value: o[r],
                            mask: i[r]
                        }
                    }
                return {
                    cursor: -1,
                    value: null,
                    mask: null
                }
            },
            d = function() {
                var e = t.split(""),
                    n = [];
                for (var i in e) "9" == e[i] || "#" == e[i] ? n.push("_") : n.push(e[i]);
                return n.join("")
            },
            u = function(e) {
                return void 0 !== p().split("")[e] && p().split("")[e]
            },
            p = function() {
                return i(f.val())
            },
            f = e(this),
            h = this;
        return this.bind = function(e) {
                i = e, "" != f.val() && f.trigger("input")
            },
            function() {
                n = d().length == a() ? l(0, !0).cursor : a(), f.attr("placeholder", d()), f.bind("click", function() {
                    r(s(f[0].selectionStart))
                }), f.bind("focus", function() {
                    "" == f.val() && f.val(d())
                }), f.bind("keydown", function(e) {
                    var t = parseInt(f[0].selectionStart);
                    switch (e.keyCode) {
                        case 37:
                            t - 1 < n ? r(n + 1) : "9" != c(t).mask && "#" != c(t).mask && r(c(t, !0).cursor + 1);
                            break;
                        case 39:
                            "9" != l(t + 1).mask && "#" != l(t + 1).mask && r(l(t + 1, !0).cursor - 1);
                            break;
                        case 8:
                            o = !0;
                            break;
                        default:
                            o = !1
                    }
                }), f.bind("input", function() {
                    var e = f[0].selectionStart,
                        i = !1;
                    !0 === o && e > n && "9" != c(e + 1).mask && "#" != c(e + 1).mask && (i = c(e, !0).cursor), f.val(function() {
                        var e = t.split(""),
                            n = [],
                            o = 0;
                        for (var r in e) !1 !== i && r == i ? (n.push("_"), o++, i = !1) : "9" == e[r] ? (!1 !== u(o) && /^[0-9]*$/i.test(u(o)) ? n.push(u(o)) : n.push("_"), o++) : "#" == e[r] ? (!1 !== u(o) && /^[a-zа-яёЁ]*$/i.test(u(o)) ? n.push(u(o)) : n.push("_"), o++) : n.push(e[r]);
                        return n.join("")
                    }()), r(s(e))
                }), f.bind("blur", function() {
                    d() == f.val() && f.val("")
                })
            }(), h
    }
}(jQuery), $(document).ready(function() {
        var e = {
            integer: function(e) {
                return e.replace(/[^0-9]/gi, "")
            },
            string: function(e) {
                return e.replace(/[^a-zа-яёЁ]/gi, "")
            },
            mix: function(e) {
                return e.replace(/[^a-zа-яёЁ0-9]/gi, "")
            },
            phone: function(e) {
                return e = e.replace(/^(?:\+7)/gi, "").replace(/(?:\+7)/gi, "").replace(/[^0-9]/gi, ""), e.length > 10 && (e = !/^831/i.test(e) && /^8/i.test(e) ? e.split("").splice(1, 11).join("") : e.split("").splice(0, 10).join("")), e
            }
        };
        $("*[data-mask]").each(function() {
            var t = $(this).attr("data-mask"),
                n = void 0 !== $(this).attr("data-mask-handler") ? $(this).attr("data-mask-handler") : "phone";
            $(this).mask(t).bind(e[n])
        })
    }),
    function(e) {
        e.fn.ssSelect = function() {
            var t, n, i, o = "ss-select",
                r = !1,
                s = function() {
                    c.trigger("ss.show.select", [l]), c.removeClass(o + "-hide").addClass(o + "-show"), i.slideDown({
                        complete: function() {
                            r = !0, c.trigger("ss.showed.select", [l])
                        }
                    })
                },
                a = function() {
                    c.trigger("ss.hide.select", [l]), i.slideUp({
                        complete: function() {
                            c.removeClass(o + "-show").addClass(o + "-hide"), r = !1, c.trigger("ss.hidden.select", [l])
                        }
                    })
                },
                l = this,
                c = e(this);
            ! function() {
                t = c.attr("data-select-name"), n = c.find("*[data-select-element='current']"), i = c.find("*[data-select-element='toggle']"), i.before('<input type="hidden" name="' + t + '" value="">'), c.addClass(o + "-hide"), i.css("display", "none"), void 0 === n.attr("data-select-value") && n.attr("data-select-value", i.find("*[data-select-element='option']").eq(0).attr("data-select-value")), i.find("*[data-select-element='option']").each(function() {
                    e(this).bind("click", function() {
                        c.trigger("ss.select.select", [l]), c.find("*").removeClass(o + "-active"), e(this).addClass(o + "-active"), n.text(e(this).text()), n.attr("data-select-value", e(this).attr("data-select-value")), c.find("input").val(e(this).attr("data-select-value")), c.trigger("ss.selected.select", [l]), a()
                    }), e(this).attr("data-select-value") == n.attr("data-select-value") && (e(this).addClass(o + "-active"), n.text(e(this).text()), c.find("input").val(e(this).attr("data-select-value")))
                }), c.bind("click", function() {
                    !1 === r ? s() : a()
                }), e(document).click(function(e) {
                    c.is(e.target) || 0 !== c.has(e.target).length || 1 != r || a()
                })
            }()
        }
    }(jQuery), $(document).ready(function() {
        function e(e) {
            if (0 != $("*[data-select='3']").length) {
                for (var n = [], i = [1, 2, 5, 10, 50, 100, 200, 500, 1e3, 2e3, 5e3], o = function(e, t) {
                        return parseInt(t.toString().split("").slice("-" + e).join(""))
                    }, r = function(e, t) {
                        for (var n = t.toString().split("").slice(0, t.toString().length - e).join(""), i = e; i > 0; i--) n += "0";
                        return parseInt(n)
                    }, s = function(e) {
                        for (var t in i)
                            if (i[t] > e) return i[t];
                        return !1
                    }, a = function(e) {
                        return e[e.length - 1]
                    }, l = function(t) {
                        var i = void 0 == t ? e : t;
                        for (i >= 3e3 && i < 4e3 && n.push(4e3); i = s(i);) n.push(i)
                    }, c = 0, d = 0, u = 1; u <= 3; u++) 0 == d && o(u, e) > 0 && (c = r(u, e), d = o(u, e));
                if (0 == c && 0 == d) l();
                else
                    for (var p = 0;;) {
                        if (p > 100) break;
                        if (s(d) <= 10 ? (d = s(d), c + d > e && n.push(c + d)) : 50 == s(d) ? (c = r(2, c), d = s(d), c + d > e && n.push(c + d)) : 1e3 == s(d) ? (c = r(3, c), d = s(d), c + d > e && n.push(c + d)) : (d = s(d), c + d > e && n.push(c + d)), 0 == o(2, a(n))) {
                            a(n) > 1e3 && o(3, a(n)) < 500 && n.push(r(3, a(n)) + 500), l(a(n));
                            break
                        }
                        p++
                    }
                if ($("*[data-select='3']").find("li").each(function(e) {
                        e > 0 ? $(this).remove() : ($("*[data-select='3']").parent().find("span").eq(0).text("-- Выбери сумму"), $(this).find("input").prop("checked", !0), $(this).find("input").unbind("change"))
                    }), e > 0)
                    for (var u in n) ! function() {
                        var e = $("<li>" + $("*[data-select='3']").find("li").eq(0).html() + "</li>");
                        e.find("input").val(n[u]), n[u] == $("*[data-checked-money]").attr("data-checked-money") ? ($("*[data-select='3']").parent().find("span").eq(0).text(n[u]), e.find("input").prop("checked", !0)) : e.find("input").prop("checked", !1), e.find("p").text(n[u]), $("*[data-select='3']").find("li:last-child").after(e)
                    }();
                $("*[data-select='3']").find("input").on("change", function(e) {
                    t(e, $(this))
                })
            }
        }
        var t = function(e, t) {
            var n = $(e.target).parents(".span").eq(0),
                i = $(e.target).parent().find("p").text();
            1 == n.parent().find("> input").prop("checked") && $("body").trigger("mouseup"), n.find("span").eq(0).text(i), t.trigger("ss.selecteddate.main", [t])
        };
        $("#promo-time-span span").text($("#promo-time-text li").eq(function() {
            var e = new Date;
            return 0 == e.getDay() ? 6 : e.getDay() - 1
        }()).find("span").text()), $(window).scroll(function() {
            $(this).scrollTop() > 700 ? $(".scrollup").fadeIn() : $(".scrollup").fadeOut()
        }), $(".scrollup").click(function() {
            return $("html, body").animate({
                scrollTop: 0
            }, 1e3), !1
        }), $(".main-slider").slick({
            autoplay: !0,
            autoplaySpeed: 5e3,
            nextArrow: '<div class="main__next"></div>',
            prevArrow: '<div class="main__prev"></div>',
            dots: !0,
            dotsClass: "main__dot"
        }), $(".recommend-slider").slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: !0,
            autoplaySpeed: 3e3,
            nextArrow: '<div class="recom__next"></div>',
            prevArrow: '<div class="recom__prev"></div>',
            responsive: [{
                breakpoint: 1230,
                settings: {
                    slidesToShow: 3
                }
            }, {
                breakpoint: 970,
                settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 570,
                settings: {
                    slidesToShow: 1
                }
            }]
        }), $(window).scroll(function() {
            $(this).scrollTop() > 170 ? $("#sidebar").css({
                position: "fixed",
                top: "0",
                height: "100%"
            }) : $("#sidebar").css({
                position: "absolute",
                top: "165px"
            })
        }), $(window).scroll(function() {
            $(this).scrollTop() > 165 ? $("#sidebar").css({
                "padding-top": "59px",
                height: "100%"
            }) : $("#sidebar").css({
                "padding-top": "0"
            })
        }), $(window).scroll(function() {
            $(this).scrollTop() > 165 ? ($(".nav-fix").css({
                display: "block",
                position: "fixed",
                top: "0px",
                width: "100%"
            }), $(".horizont-menu").css({
                position: "fixed",
                top: "57px"
            })) : ($(".nav-fix").css({
                position: "static",
                display: "none"
            }), $(".horizont-menu").css({
                position: "static",
                top: "0"
            }))
        }), $(window).scroll(function() {
            $(this).scrollTop() > 165 ? $("#logo-nav").css({
                display: "inline-block"
            }) : $("#logo-nav").css({
                display: "none"
            })
        }), $(window).scroll(function() {
            $(this).scrollTop() > 111 ? $(".saving-success").css({
                position: "fixed",
                top: "59px"
            }) : $(".saving-success").css({
                position: "relative",
                top: "0px"
            })
        }), $(".sidebar").mCustomScrollbar({
            scrollButtons: {
                enable: !0
            }
        }), $(".composition").mCustomScrollbar({}), $(".sidebar .mCSB_scrollTools .mCSB_buttonDown").hover(function() {
            $(".sidebar-title").css("display", "inline-block"), $(".sidebar .mCSB_scrollTools .mCSB_buttonUp").css("width", "260px"), $(".sidebar .mCSB_scrollTools .mCSB_buttonDown").css("width", "260px")
        }, function() {
            $(".sidebar-title").css("display", "none"), $(".sidebar .mCSB_scrollTools .mCSB_buttonUp").css("width", "80px"), $(".sidebar .mCSB_scrollTools .mCSB_buttonDown").css("width", "80px")
        }), $(".sidebar .mCSB_scrollTools .mCSB_buttonUp").hover(function() {
            $(".sidebar-title").css("display", "inline-block"), $(".sidebar .mCSB_scrollTools .mCSB_buttonUp").css("width", "260px"), $(".sidebar .mCSB_scrollTools .mCSB_buttonDown").css("width", "260px")
        }, function() {
            $(".sidebar-title").css("display", "none"), $(".sidebar .mCSB_scrollTools .mCSB_buttonUp").css("width", "80px"), $(".sidebar .mCSB_scrollTools .mCSB_buttonDown").css("width", "80px")
        }), $(".sidebar-item").hover(function() {
            $(".sidebar-title").css("display", "inline-block"), $(".sidebar .mCSB_scrollTools .mCSB_buttonUp").css("width", "260px"), $(".sidebar .mCSB_scrollTools .mCSB_buttonDown").css("width", "260px")
        }, function() {
            $(".sidebar-title").css("display", "none"), $(".sidebar .mCSB_scrollTools .mCSB_buttonUp").css("width", "80px"), $(".sidebar .mCSB_scrollTools .mCSB_buttonDown").css("width", "80px")
        }), $(".recommend-btn").on("click", function() {
            $(this).parent().find(".recommend-btn").css("display", "none"), $(this).parent().find(".recommend-quantity-btn").css("display", "inline-block")
        }), $(".person-quantity .minus").click(function() {
            var e = $(this).parent().find("input[type=text]"),
                t = parseInt(e.val()) - 1;
            return t = t < 1 ? 1 : t, e.val(t), e.change(), !1
        }), $(".person-quantity .plus").click(function() {
            var e = $(this).parent().find("input[type=text]");
            return e.val(parseInt(e.val()) + 1), e.change(), !1
        }), $(".btn-certificate").on("click", function() {
            $(".cart-certificate-popup").slideDown()
        }), $(".promo-delivery").on("click", function() {
            $(".promo-delivery span").css({
                "border-width": "0"
            }), $(".promo-time span").css({
                "border-width": "1px"
            }), $(".promo-personal").css({
                "border-width": "1px"
            }), $(".delivery-popup").slideDown().addClass("active"), $(".time-popup").slideUp().removeClass("active"), $(".personal-popup").slideUp().removeClass("active"), $(".product-card-popup").slideUp().removeClass("active")
        }), $(".product-card-delivery").on("click", function() {
            $(".promo-delivery span").css({
                "border-width": "1px"
            }), $(".promo-time span").css({
                "border-width": "1px"
            }), $(".product-card-delivery span").css({
                "border-width": "0px"
            }), $(".product-card-popup").slideDown().addClass("active"), $(".time-popup").slideUp().removeClass("active"), $(".personal-popup").slideUp().removeClass("active"), $(".delivery-popup").slideUp().removeClass("active")
        }), $(document).mouseup(function(e) {
            var t = $(".cart-certificate-popup");
            t.is(e.target) || 0 !== t.has(e.target).length || t.slideUp()
        }), $(document).mouseup(function(e) {
            var t = $(".delivery-popup");
            t.is(e.target) || 0 !== t.has(e.target).length || (t.slideUp(), $(".promo-delivery span").css({
                "border-width": "1px"
            }))
        }), $(document).mouseup(function(e) {
            var t = $(".time-popup");
            t.is(e.target) || 0 !== t.has(e.target).length || (t.slideUp(), $(".promo-time span").css({
                "border-width": "1px"
            }))
        }), $(document).mouseup(function(e) {
            var t = $(".personal-popup");
            t.is(e.target) || 0 !== t.has(e.target).length || (t.slideUp(), $(".promo-personal").css({
                "border-width": "1px"
            }))
        }), $(".close").on("click", function() {
            $(".getpasword-popup").css({
                display: "none"
            }), $(".getpasword-popup-msg").css({
                display: "none"
            }), $(".getpasword-popup-error").css({
                display: "none"
            }), $(".getpasword-popup-bgc").css({
                display: "none"
            }), $(".successreg-popup").css({
                display: "none"
            }), $(".order-item-popup").css({
                display: "none"
            }), $(".order-item-popup-bgc").css({
                display: "none"
            }), $(".delivery-popup").slideUp().removeClass("active"), $(".promo-delivery span").css({
                "border-width": "1px"
            }), $(".product-card-popup").slideUp().removeClass("active"), $(".product-card-delivery span").css({
                "border-width": "1px"
            }), $(".promo-time span").css({
                "border-width": "1px"
            }), $(".time-popup").slideUp().removeClass("active"), $(".personal-popup").slideUp().removeClass("active"), $(".cart-certificate-popup").slideUp()
        }), $(".promo-time").on("click", function() {
            $(".promo-time span").css({
                "border-width": "0"
            }), $(".promo-delivery span").css({
                "border-width": "1px"
            }), $(".product-card-delivery span").css({
                "border-width": "1px"
            }), $(".promo-personal").css({
                "border-width": "1px"
            }), $(".time-popup").slideDown().addClass("active"), $(".delivery-popup").slideUp().removeClass("active"), $(".personal-popup").slideUp().removeClass("active"), $(".product-card-popup").slideUp().removeClass("active")
        }), $(".promo-personal").on("click", function() {
            $(".promo-personal").css({
                "border-width": "0"
            }), $(".promo-delivery span").css({
                "border-width": "1px"
            }), $(".product-card-delivery span").css({
                "border-width": "1px"
            }), $(".promo-time span").css({
                "border-width": "1px"
            }), $(".personal-popup").slideDown().addClass("active"), $(".delivery-popup").slideUp().removeClass("active"), $(".time-popup").slideUp().removeClass("active"), $(".product-card-popup").slideUp().removeClass("active")
        }), $(".content-link0").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link0").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link1").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link1").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link2").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link2").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link3").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link3").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link4").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link4").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link5").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link5").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link6").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link6").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link7").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link7").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link8").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link8").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link9").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link9").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link10").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link10").offset().top + "px"
            }, {
                duration: 500
            })
        }), $(".content-link11").on("click", function() {
            $("html,body").animate({
                scrollTop: $("#content-link11").offset().top + "px"
            }, {
                duration: 500
            })
        }), $("body").bind("ss.loaded.cart", function() {
            $(".order-nav").on("click", function() {
                $(".order-popup-bgc").toggleClass("open"), $(".order-popup").toggleClass("open2"), $(".order-popup-bgc").hasClass("open") ? $(".order-popup-wrapper").animate({
                    right: "0px"
                }, 500) : $(".order-popup-wrapper").animate({
                    right: "-500px"
                }, 500)
            }), $(".order-popup-bgc").on("click", function() {
                $(".order-popup-bgc").removeClass("open"), $(".order-popup").removeClass("open2"), $(".order-popup-wrapper").animate({
                    right: "-500px"
                }, 500)
            });
            var e = function(e) {
                    e.matches ? $(window).scroll(function() {
                        $(this).scrollTop(), $(".order-popup-wrapper").css({
                            top: "0px"
                        })
                    }) : $(window).scroll(function() {
                        $(this).scrollTop() > 110 ? $(".order-popup-wrapper").css({
                            top: "59px"
                        }) : $(".order-popup-wrapper").css({
                            top: "169px"
                        })
                    })
                },
                t = window.matchMedia("all and (max-width: 990px)");
            e(t), t.addListener(e)
        }), $(".oferta-check").parent().find("input[type='checkbox']").on("change", function() {
            var e = $(this).parents("form").eq(0);
            e.find("*[type='submit']").removeAttr("disabled"), $(this).prop("checked") || e.find("*[type='submit']").attr("disabled", "disabled")
        }), $(".tabs3-nav-item").on("click", function() {
            $(".tabs3-nav-item").removeClass("current"), $(".tabs3-content-item").removeClass("current");
            var e = $(this).attr("data-tab");
            $('.tabs [data-tab="' + e + '"]').addClass("current")
        }), $(".forgot").on("click", function() {
            $(".getpasword-popup").css({
                display: "flex"
            }), $(".getpasword-popup-bgc").css({
                display: "block"
            })
        }), $(".getpasword-popup-bgc").on("click", function() {
            $(".getpasword-popup").css({
                display: "none"
            }), $(".getpasword-popup-msg").css({
                display: "none"
            }), $(".getpasword-popup-error").css({
                display: "none"
            }), $(".getpasword-popup-bgc").css({
                display: "none"
            }), $(".successreg-popup").css({
                display: "none"
            })
        }), $(".reg-form-btn").on("click", function() {
            $(".successreg-popup").css({
                display: "flex"
            }), $(".getpasword-popup-bgc").css({
                display: "block"
            })
        }), $(".successreg-btn").on("click", function() {
            $(".tabs-nav-item").removeClass("current"), $(".tabs-content-item").removeClass("current"), $('.tabs [data-tab="0"]').addClass("current"),
                $(".successreg-popup").css({
                    display: "none"
                })
        }), $("body").bind("ss.loaded.cart", function() {
            $(".name-btn").on("click", function() {
                $(".order-item-popup").css({
                    display: "flex"
                }), $(".order-item-popup-bgc").css({
                    display: "block"
                })
            })
        }), $(".no-short-change").on("change", function() {
            var e = $(".no-short-change").prop("checked");
            1 == e ? $(".short-change .delivery-date-select").prop("disabled", !0) : 0 == e && $(".short-change .delivery-date-select").prop("disabled", !1)
        });
        var n = function(e) {
                e.matches ? ($(".radio-btn-new").on("change", function() {
                    1 == $(".radio-btn-new").prop("checked") && ($(".label-next-old").addClass("no-checked-adress"), $(".label-next-new").slideDown().removeClass("no-checked-adress"))
                }), $(".radio-btn-old").on("change", function() {
                    1 == $(".radio-btn-old").prop("checked") && ($(".label-next-new").slideUp(), $(".label-next-new").addClass("no-checked-adress"))
                })) : $(".radio-btn-new").on("change", function() {
                    1 == $(".radio-btn-new").prop("checked") && ($(".label-next-old").addClass("no-checked-adress"), $(".label-next-new").removeClass("no-checked-adress"))
                })
            },
            i = window.matchMedia("all and (max-width: 767px)");
        n(i), i.addListener(n), $(".your-dish-inp").on("change", function() {
            var e = $(this).prop("checked"),
                t = $(this).attr("data-check");
            1 == e ? ($('.yes[data-check="' + t + '"]').css({
                color: "#303746",
                "font-weight": "700"
            }), $('.no[data-check="' + t + '"]').css({
                color: "#7d7d7d",
                "font-weight": "400"
            })) : 0 == e && ($('.no[data-check="' + t + '"]').css({
                color: "#303746",
                "font-weight": "700"
            }), $('.yes[data-check="' + t + '"]').css({
                color: "#7d7d7d",
                "font-weight": "400"
            }))
        }), $(".main-select").on("change", function() {
            var e = $(this).prop("checked"),
                t = $(this).attr("data-select");
            1 == e ? $('.select-dish[data-select="' + t + '"]').slideDown() : 0 == e && $('.select-dish[data-select="' + t + '"]').slideUp()
        }), $(".select-dish input").on("change", function(e) {
            var t = $(e.target).parents(".span").eq(0),
                n = $("<p>" + $(e.target).parent().find("p").html() + "</p>");
            1 == t.parent().find("> input").prop("checked") && $("body").trigger("mouseup"), n.find("span").remove(), t.find("span").eq(0).text(n.text())
        }), $(".type-select").on("change", function() {
            var e = $(this).prop("checked"),
                t = $(this).attr("data-select");
            1 == e ? $('.select-type[data-select="' + t + '"]').slideDown() : 0 == e && $('.select-type[data-select="' + t + '"]').slideUp()
        }), $(".select-date-tab1").bind("ss.selecteddate.main", function() {
            var e = $(this).parents(".payment").eq(0),
                t = function(t) {
                    switch (t) {
                        case "show":
                            e.find(".short-change").css("display", ""), e.find(".label3").css("display", "");
                            break;
                        case "hide":
                            e.find(".short-change").css("display", "none"), e.find(".label3").css("display", "none")
                    }
                },
                n = function(t) {
                    switch (t) {
                        case "show":
                            e.find(".label6").css("display", "");
                            break;
                        case "hide":
                            e.find(".label6 input").prop("checked", !1), e.find(".label6").css("display", "none")
                    }
                };
            switch (e.find(".payment-form .span span").text()) {
                case "Наличный расчет":
                default:
                    t("show"), n("hide");
                    break;
                case "Картой курьеру":
                    t("hide"), n("hide");
                    break;
                case "Онлайн":
                    t("hide"), n("show")
            }
        }), $(".select-date input").on("change", function(e) {
            t(e, $(this))
        }), $(".delivery-date-select").on("change", function() {
            var e = $(this).prop("checked"),
                t = $(this).attr("data-select");
            1 == e ? $('.select-date[data-select="' + t + '"]').slideDown() : 0 == e && $('.select-date[data-select="' + t + '"]').slideUp()
        }), $(document).mouseup(function(e) {
            var t = $(".delivery-time .span");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-date[data-select="1"]').slideUp(), $(".delivery-time .delivery-date-select").prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".delivery-date .span");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-date[data-select="0"]').slideUp(), $(".delivery-date .delivery-date-select").prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".payment-form .span");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-date[data-select="2"]').slideUp(), $(".payment-form .delivery-date-select").prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".short-change .span");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-date[data-select="3"]').slideUp(), $(".short-change .delivery-date-select").prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".cafe-adress .span");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-date[data-select="4"]').slideUp(), $(".cafe-adress .delivery-date-select").prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".delivery-address .span");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-date[data-select="4"]').slideUp(), $(".delivery-address .delivery-date-select").prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".select-dish-input .span");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-dish[data-select="0"]').slideUp(), $(".select-dish-input .main-select").prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".select-dish-input .span");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-dish[data-select="1"]').slideUp(), $(".select-dish-input .main-select").prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".select-dish-input .span");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-dish[data-select="2"]').slideUp(), $(".select-dish-input .main-select").prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".type");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-type[data-select="0"]').slideUp(), $('.type-select[data-select="0"]').prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".ingredient");
            t.is(e.target) || 0 !== t.has(e.target).length || ($('.select-type[data-select="1"]').slideUp(), $('.type-select[data-select="1"]').prop("checked", !1))
        }), $(document).mouseup(function(e) {
            var t = $(".product-card-popup");
            t.is(e.target) || 0 !== t.has(e.target).length || (t.slideUp(), $(".product-card-delivery span").css({
                "border-width": "1px"
            }))
        }), $(".profile-select-box.profile-select-day .profile-main-select, .profile-select-box.profile-select-year .profile-main-select, .profile-select-box.profile-select-month .profile-main-select").on("change", function() {
            var e = $(this).prop("checked");
            1 == e ? $(this).parent().find(".profile-select-options").slideDown() : 0 == e && $(this).parent().find(".profile-select-options").slideUp()
        }), $(document).mouseup(function(e) {
            var t = $(".profile-select-box .span");
            t.is(e.target) || 0 !== t.has(e.target).length || ($(".profile-select-box .profile-select-options").slideUp(), $(".profile-select-box .profile-select .profile-main-select").prop("checked", !1))
        }), $(".profile-select-box .profile-select-options input").on("change", function(e) {
            var t = $(e.target).parents(".profile-select-box").eq(0),
                n = function() {
                    return t.hasClass("profile-select-year") ? "year" : t.hasClass("profile-select-month") ? "month" : t.hasClass("profile-select-day") ? "day" : void 0
                }(),
                i = function(e, t, n) {
                    var i = void 0 === n ? "" : n;
                    return $(".profile-select-box.profile-select-" + e + " .profile-select-options input").each(function() {
                        if (!0 === $(this).prop("checked")) switch (t) {
                            case "label":
                                i = $(this).parent().find("p").text();
                                break;
                            case "input":
                                i = $(this).val()
                        }
                    }), "" == i ? null : i
                };
            1 == t.find(".profile-main-select").prop("checked") && $("body").trigger("mouseup"), t.find(".span span").eq(0).text(i(n, "label")), "year" != n && "month" != n || function() {
                var e = i("year", "input", "1900"),
                    t = i("month", "input", "01"),
                    n = i("day", "input"),
                    o = new Date(e, t, 0).getDate(),
                    r = $(".profile-select-box.profile-select-day .profile-select-options li");
                r.attr("hidden", "true");
                for (var s = 0; s <= o; s++) r.eq(s).removeAttr("hidden");
                null !== n && parseInt(n) > parseInt(o) && (r.each(function() {
                    !0 === $(this).find("input").prop("checked") && $(this).find("input").prop("checked", !1)
                }), r.eq(0).find("input").trigger("click"))
            }()
        });
        var n = function(e) {
                e.matches ? ($("body").addClass("slick-additional-items"), $(".additional-items").slick({
                    arrows: !1,
                    dots: !0,
                    dotsClass: "main__dot",
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    responsive: [{
                        breakpoint: 650,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    }, {
                        breakpoint: 470,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }]
                })) : $("body").hasClass("slick-additional-items") && ($(".additional-items").slick("unslick"), $("body").removeClass("slick-additional-items"))
            },
            i = window.matchMedia("all and (max-width: 767px)");
        n(i), i.addListener(n), $(".vandam-detales-table-small").trigger("enhance.tablesaw"), $(".drop-btn").on("click", function() {
                $(".drop-menu-list").slideDown()
            }), $("#drop-item a").on("click", function() {
                $(".drop-menu-list").slideUp()
            }), $(document).mouseup(function(e) {
                var t = $("#drop-item a");
                t.is(e.target) || 0 !== t.has(e.target).length || $(".drop-menu-list").slideUp()
            }), $(".horizont-menu ul").slick({
                slidesToShow: 8,
                slidesToScroll: 2,
                autoplay: !1,
                nextArrow: '<div class="main__next"></div>',
                prevArrow: '<div class="main__prev"></div>',
                infinite: !1,
                responsive: [{
                    breakpoint: 700,
                    settings: {
                        slidesToShow: 7
                    }
                }, {
                    breakpoint: 620,
                    settings: {
                        slidesToShow: 6
                    }
                }, {
                    breakpoint: 570,
                    settings: {
                        slidesToShow: 5
                    }
                }, {
                    breakpoint: 470,
                    settings: {
                        slidesToShow: 4
                    }
                }, {
                    breakpoint: 400,
                    settings: {
                        slidesToShow: 3
                    }
                }]
            }), $("body").bind("ss.save.cart", function() {
                setTimeout(function() {
                    1 == $("#order-popup-items > .order-popup-item").length && $("#order-popup-items .mCSB_container").append($("#order-popup-items > .order-popup-item"))
                }, 250)
            }), $("body").bind("ss.loaded.cart ss.save.cart ss.destroy.cart", function() {
                ssDeals().handler()
            }), $("body").bind("ss.change.cart", function(e, t, n, i) {
                var o;
                if (n > 0)
                    for (var r in ssDeals().getDeals()) o = ssDeals().getDeals()[r],
                        function() {
                            for (var e in o.products)
                                if (t.id == o.products[e]) return !0;
                            return !1
                        }() && (o.dataset.product_id = t.id, !1 === o.isActive() && (i.abort = !0), o.dataset.product_id = null)
            }), $("body").bind("ss.save.cart", function(e, t) {
                "none" != $(t.name + "-" + t.id).find(".product-btn").css("display") && ($(t.name + "-" + t.id).find(".product-btn").css("display", "none"), $(t.name + "-" + t.id).find(".product-quantity-btn").css("display", "inline-block"))
            }), $("body").bind("ss.destroy.cart", function(e, t) {
                $(t.name + "-" + t.id).find(".product-btn").css("display", ""), $(t.name + "-" + t.id).find(".product-quantity-btn").css("display", "none")
            }), $("body").bind("ss.save.cart ss.destroy.cart", function(e, t) {
                for (var n in t.data)
                    if (t.data[n].id == t.id) return void $(t.name + "-" + t.id).find("input").val(t.data[n].amount);
                $(t.name + "-" + t.id).find("input").val(0)
            }), //$(".delivery-time-date").each(function() {
            //     var e = $(this),
            //         t = [
            //             [9, 22],
            //             [9, 22],
            //             [9, 22],
            //             [9, 22],
            //             [9, 22],
            //             [9, 23],
            //             [9, 23]
            //         ],
            //         n = function(e) {
            //             var t = parseInt(e.split("-")[0]),
            //                 n = parseInt(e.split("-")[1]) - 1,
            //                 i = parseInt(e.split("-")[2]);
            //             return new Date(t, n, i).getDay()
            //         },
            //         i = function(e, i) {
            //             if (i.find(".delivery-time .select-date li").each(function() {
            //                     "00:00" != $(this).find("input").val() && $(this).attr("hidden", !0)
            //                 }), !0 === function(e) {
            //                     var t = !1;
            //                     return i.find(".delivery-date .select-date input").each(function() {
            //                         $(this).val() == e && "Сегодня" == $(this).parent().find("p").text() && (t = !0)
            //                     }), t
            //                 }(e))
            //                 for (var o = function() {
            //                         var e = parseInt((new Date).getHours()),
            //                             t = parseInt((new Date).getMinutes()),
            //                             n = 60 * e + t + 90;
            //                         return Math.floor(n / 60)
            //                     }(), r = function() {
            //                         var e = parseInt((new Date).getHours()),
            //                             t = parseInt((new Date).getMinutes()),
            //                             n = 60 * e + t + 90;
            //                         return n - 60 * Math.floor(n / 60)
            //                     }(), s = o; s <= t[n(e)][1]; s++) i.find(".delivery-time .select-date li").each(function() {
            //                     s == o && $(this).find("input").val() == s + ":30" && r < 30 && $(this).removeAttr("hidden"), s != o && ($(this).find("input").val() != s + ":00" && $(this).find("input").val() != s + ":30" || $(this).removeAttr("hidden"))
            //                 });
            //             else
            //                 for (var s = t[n(e)][0]; s <= t[n(e)][1]; s++) i.find(".delivery-time .select-date li").each(function() {
            //                     $(this).find("input").val() != s + ":00" && $(this).find("input").val() != s + ":30" || $(this).removeAttr("hidden")
            //                 });
            //             i.find(".delivery-time .select-date li").eq(0).find("label").trigger("click")
            //         };
            //     i($(this).find(".delivery-date .select-date input").eq(0).val(), e), $(this).find(".delivery-date .select-date input").bind("change", function(e) {
            //         i($(this).val(), $(this).parents(".delivery-time-date").eq(0))
            //     })
            /*}),*/ $("body").bind("ss.save.cart ss.loaded.cart ss.destroy.cart", function(t, n) {
                e(n.totalSum(!0))
            }), $(".order-track-left").length > 0 && $(".order-track").length > 0 && setInterval(function() {
                $.get("", {}, function(e) {
                    e = $("<div>" + e + "</div>"), 0 == $(".order-track-left .tracking-map iframe").length && $(".order-track-left").html(e.find(".order-track-left").html()), $(".order-track").html(e.find(".order-track").html())
                }, "html")
            }, 6e4), $("*[data-select-slug]").each(function() {
                $(this).ssSelect()
            }),
            function() {
                if (0 != $(".street-form").length) {
                    var e = function() {
                            return $(".city-form").find("*[data-select-element='current']").attr("data-select-value")
                        },
                        t = new ssSearch({
                            obj: ".street-form",
                            ajaxPath: $(".street-form").attr("data-search-street-url"),
                            notFound: $(".street-form").attr("data-search-street-message"),
                            exceptions: $(".street-form").attr("data-search-street-exceptions"),
                            token: $(".street-form").attr("data-search-street-token")
                        }).bind("run", function() {
                            $(".street-form .ss-search-select-result").val($(".street-form .ss-search-field").val())
                        }).bind("loaded", function() {
                            $(".street-form .ss-search-list").css("display", "none"), "Нижний Новгород" == e() && $(".street-form .ss-search-list li").length > 0 && ($(".street-form .ss-search-list").css("display", ""), t.position())
                        }).bind("select", function(e, n) {
                            var i = n("text", $(".street-form .ss-search-keyboard-name").text());
                            t.toggle(), $(".street-form .ss-search-field").val(i), $(".street-form .ss-search-select-result").val(i)
                        }).bind("toggle-open", function() {
                            $(".street-form .ss-search-list").css("display", "none")
                        });
                    $("*[data-select-slug='order-tab1-city']").bind("ss.selected.select", function(e, t) {
                        $(".street-form .ss-search-keyboard-name").text(""), $(".street-form .ss-search-field").val(""), $(".street-form .ss-search-select-result").val(""), $(".street-form .ss-search-list ul").html("")
                    }), t.init()
                }
            }()
    }), $(document).ready(function() {
        var e = function() {
            $("*[data-filter-box]").css("display", "");
            var e = function() {
                    var e = [];
                    return $("*[data-filter-panel='tag']").each(function() {
                        !0 === $(this).prop("checked") && e.push($(this).attr("data-filter-value"))
                    }), e
                },
                t = function() {
                    var e = [];
                    return $("*[data-filter-panel='product']").each(function() {
                        !0 === $(this).prop("checked") && e.push($(this).attr("data-filter-value"))
                    }), e
                };
            e().length > 0 && $("*[data-filter-box]").each(function() {
                var t = $(this);
                !1 === function() {
                    var n;
                    for (var i in e())
                        if (n = new RegExp(e()[i], "gi"), n.test(t.find("*[data-filter-dataset='tags']").text())) return !0;
                    return !1
                }() && t.css("display", "none")
            }), t().length > 0 && $("*[data-filter-box]").each(function() {
                var e = $(this);
                !1 === function() {
                    var n;
                    for (var i in t())
                        if (n = new RegExp(t()[i], "gi"), !n.test(e.find("*[data-filter-dataset='products']").text())) return !1;
                    return !0
                }() && e.css("display", "none")
            })
        };
        $("*[data-filter-panel]").bind("change", function() {
            e()
        })
    });
var ssCartVariable = null,
    ssCartAdditVariable = null,
    ssPromocodeVariable = null,
    ssConstructorVariable = null,
    ssAddressVariable = null,
    ssRecaptchaVariable = {},
    ssDealVariable = null,
    sitemap = new ssSM;