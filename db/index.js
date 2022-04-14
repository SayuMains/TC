import mongoose from 'mongoose';
import Global from './global.js';
import Message from './message.js';
import Nickname from './nickname.js';
import Log from './log.js';


export async function message(msg) {
  const id = msg.id || msg;
  return id && Message.findOne({ $or: [ { 'original.message': id }, { 'mirrors.message': id } ] });
}

export async function messages(msgs) {
  const ids = msgs.map(msg => msg.id || msg).filter(m => m);
  return Message.find({ $or: [ { 'original.message': ids }, { 'mirrors.message': ids } ] });
}

export async function nickname(member) {
  const entry = await Nickname.findOne({ user_id: member.id });
  return entry?.nickname ?? member.displayName;
}

export async function reference(msg) {
  const id = msg.reference?.messageId;
  return id && message(id);
}

export async function global(name) {
  return Global.findOne({ name });
}

export async function subscription(channel) {
  const id = channel.id || channel;
  return id && Global.findOne({ subscriptions: id });
}

export async function logs(timestamp = 0) {
  return Log.find({ t: { $lt: timestamp } });
}


await mongoose.connect(process.env.MONGO);

export { Global, Message, Nickname, Log };