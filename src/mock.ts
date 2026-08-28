import aeFlag from './assets/images/flags/ae.webp';
import arFlag from './assets/images/flags/ar.webp';
import auFlag from './assets/images/flags/au.webp';
import bgFlag from './assets/images/flags/bg.webp';
import brFlag from './assets/images/flags/br.webp';
import caFlag from './assets/images/flags/ca.webp';
import chFlag from './assets/images/flags/ch.webp';
import cnFlag from './assets/images/flags/cn.webp';
import czFlag from './assets/images/flags/cz.webp';
import dkFlag from './assets/images/flags/dk.webp';
import egFlag from './assets/images/flags/eg.webp';
import euFlag from './assets/images/flags/eu.webp';
import gbFlag from './assets/images/flags/gb.webp';
import hkFlag from './assets/images/flags/hk.webp';
import huFlag from './assets/images/flags/hu.webp';
import idFlag from './assets/images/flags/id.webp';
import inFlag from './assets/images/flags/in.webp';
import isFlag from './assets/images/flags/is.webp';
import jpFlag from './assets/images/flags/jp.webp';
import krFlag from './assets/images/flags/kr.webp';
import mxFlag from './assets/images/flags/mx.webp';
import myFlag from './assets/images/flags/my.webp';
import noFlag from './assets/images/flags/no.webp';
import nzFlag from './assets/images/flags/nz.webp';
import phFlag from './assets/images/flags/ph.webp';
import plFlag from './assets/images/flags/pl.webp';
import roFlag from './assets/images/flags/ro.webp';
import ruFlag from './assets/images/flags/ru.webp';
import saFlag from './assets/images/flags/sa.webp';
import seFlag from './assets/images/flags/se.webp';
import sgFlag from './assets/images/flags/sg.webp';
import thFlag from './assets/images/flags/th.webp';
import trFlag from './assets/images/flags/tr.webp';
import twFlag from './assets/images/flags/tw.webp';
import uaFlag from './assets/images/flags/ua.webp';
import usFlag from './assets/images/flags/us.webp';
import zaFlag from './assets/images/flags/za.webp';

export const flagMap: Record<string, string> = {
  AED: aeFlag,
  ARS: arFlag,
  AUD: auFlag,
  BGN: bgFlag,
  BRL: brFlag,
  CAD: caFlag,
  CHF: chFlag,
  CNY: cnFlag,
  CZK: czFlag,
  DKK: dkFlag,
  EGP: egFlag,
  EUR: euFlag,
  GBP: gbFlag,
  HKD: hkFlag,
  HUF: huFlag,
  IDR: idFlag,
  INR: inFlag,
  ISK: isFlag,
  JPY: jpFlag,
  KRW: krFlag,
  MXN: mxFlag,
  MYR: myFlag,
  NOK: noFlag,
  NZD: nzFlag,
  PHP: phFlag,
  PLN: plFlag,
  RON: roFlag,
  RUB: ruFlag,
  SAR: saFlag,
  SEK: seFlag,
  SGD: sgFlag,
  THB: thFlag,
  TRY: trFlag,
  TWD: twFlag,
  UAH: uaFlag,
  USD: usFlag,
  ZAR: zaFlag,
};

export const currencies = Object.keys(flagMap);
